"""Scan API routes."""
from datetime import datetime
from typing import Optional
import tempfile
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.models.scan import Scan, ScanFinding, ScanTimeline, ScanStatus, ScanType, Severity
from app.models.report import Report
from app.api.auth import get_current_user
from app.services.risk_engine import calculate_risk_score, get_verdict
from app.scanners.website_scanner import WebsiteScanner
from app.scanners.file_scanner import FileScanner
from app.scanners.source_code_scanner import SourceCodeScanner

router = APIRouter()


class WebsiteScanRequest(BaseModel):
    url: str


def generate_scan_id(db: Session) -> str:
    today = datetime.utcnow().strftime("%Y%m%d")
    count = db.query(Scan).count() + 1
    return f"SCAN-{today}-{count:05d}"


def _add_timeline(db: Session, scan_db_id: int, stage: str, status: str = "completed"):
    event = ScanTimeline(scan_id=scan_db_id, stage=stage, status=status)
    db.add(event)


def _save_findings(db: Session, scan_db_id: int, raw_findings: list) -> dict:
    """Save findings to DB and return counts."""
    counts = {"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0}
    for f in raw_findings:
        severity_str = f.get("severity", "info")
        try:
            severity = Severity(severity_str)
        except ValueError:
            severity = Severity.info

        finding = ScanFinding(
            scan_id=scan_db_id,
            title=f.get("title", "Unknown Finding"),
            severity=severity,
            confidence=f.get("confidence", 50),
            description=f.get("description", ""),
            evidence=f.get("evidence", ""),
            location=f.get("location"),
            affected_component=f.get("affected_component"),
            impact=f.get("impact", ""),
            recommendation=f.get("recommendation", ""),
            category=f.get("category", "Other"),
            file_path=f.get("file_path"),
            line_number=f.get("line_number"),
            ai_explanation=f.get("ai_explanation"),
        )
        db.add(finding)
        counts[severity_str] = counts.get(severity_str, 0) + 1
    return counts


def _update_scan_result(db: Session, scan: Scan, raw_findings: list):
    """Update scan with findings, risk score, and timeline."""
    # Save findings
    counts = _save_findings(db, scan.id, raw_findings)

    # Calculate risk score
    risk = calculate_risk_score(raw_findings)
    scan.risk_score = risk["total_score"]
    scan.risk_level = risk["risk_level"]
    scan.verdict = get_verdict(risk["total_score"])
    scan.findings_count_critical = counts["critical"]
    scan.findings_count_high = counts["high"]
    scan.findings_count_medium = counts["medium"]
    scan.findings_count_low = counts["low"]
    scan.findings_count_info = counts["info"]
    scan.status = ScanStatus.completed
    scan.completed_at = datetime.utcnow()

    # Add timeline events
    now = datetime.utcnow()
    _add_timeline(db, scan.id, "Submitted")
    _add_timeline(db, scan.id, "Validation")
    _add_timeline(db, scan.id, "Security Analysis")
    _add_timeline(db, scan.id, "Threat Detection")
    _add_timeline(db, scan.id, "Risk Calculation")
    _add_timeline(db, scan.id, "Report Generation")
    _add_timeline(db, scan.id, "Completed")

    # Create a basic report
    severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3, "info": 4}
    sorted_findings = sorted(raw_findings, key=lambda x: severity_order.get(x.get("severity", "info"), 5))
    top_findings_text = "\n".join(
        f"- [{f.get('severity', 'info').upper()}] {f.get('title', 'Unknown')}: {f.get('description', '')}"
        for f in sorted_findings[:5]
    ) or "No findings detected."

    report = Report(
        scan_id=scan.id,
        title=f"Security Analysis Report - {scan.target}",
        executive_summary=f"Automated security analysis of {scan.target} identified {len(raw_findings)} findings. Risk score: {risk['total_score']}/100 ({risk['risk_level']}).\n\nTop findings:\n{top_findings_text}",
        overall_score=risk["total_score"],
        risk_level=risk["risk_level"],
        verdict=scan.verdict.value,
        remediation_plan=[
            {"priority": i + 1, "title": f.get("title", ""), "severity": f.get("severity", "info"), "description": f.get("recommendation", "")}
            for i, f in enumerate(sorted_findings[:5])
        ],
        final_recommendation=f"Address the {len(raw_findings)} identified findings based on severity. Critical and high-severity issues should be remediated immediately.",
    )
    db.add(report)

    db.commit()
    db.refresh(scan)


@router.post("/website")
async def submit_website_scan(
    request: WebsiteScanRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scan_id = generate_scan_id(db)
    scan = Scan(
        scan_id=scan_id,
        user_id=current_user.id,
        type=ScanType.website,
        target=request.url,
        status=ScanStatus.analyzing,
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    # Run the actual scanner
    scanner = WebsiteScanner()
    try:
        result = await scanner.scan(request.url)
    except Exception as e:
        result = {"findings": [], "errors": [str(e)]}

    raw_findings = result.get("findings", [])

    # Add an info finding if there were errors but no findings
    if not raw_findings and result.get("errors"):
        raw_findings.append({
            "title": "Scan Completed with Warnings",
            "severity": "info",
            "confidence": 100,
            "description": f"Scan completed but encountered issues: {'; '.join(result['errors'])}",
            "evidence": str(result["errors"]),
            "impact": "Partial scan results may not reflect the full security posture.",
            "recommendation": "Try rescan or check if the target is reachable.",
            "category": "Scan Info",
        })

    _update_scan_result(db, scan, raw_findings)

    return {
        "scan_id": scan.id,
        "scan_uid": scan_id,
        "status": "COMPLETED",
        "findings_count": len(raw_findings),
        "risk_score": scan.risk_score,
    }


@router.post("/file")
async def submit_file_scan(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scan_id = generate_scan_id(db)
    scan = Scan(
        scan_id=scan_id,
        user_id=current_user.id,
        type=ScanType.file,
        target=file.filename or "uploaded_file",
        status=ScanStatus.analyzing,
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    # Save uploaded file to temp location
    suffix = os.path.splitext(file.filename or "upload")[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        scanner = FileScanner()
        result = await scanner.scan(tmp_path, file.filename or "uploaded_file")
    except Exception as e:
        result = {"findings": [], "errors": [str(e)], "metadata": {}}
    finally:
        os.unlink(tmp_path)

    raw_findings = result.get("findings", [])

    # Add metadata as info finding
    metadata = result.get("metadata", {})
    if metadata:
        raw_findings.append({
            "title": "File Metadata",
            "severity": "info",
            "confidence": 100,
            "description": f"File: {metadata.get('filename', 'unknown')}, Size: {metadata.get('size', 0)} bytes, SHA256: {metadata.get('sha256', 'N/A')[:32]}...",
            "evidence": f"Extension: {metadata.get('extension', 'N/A')}, Hash: {metadata.get('sha256', 'N/A')[:32]}...",
            "impact": "N/A - Informational",
            "recommendation": "Review file metadata for anomalies.",
            "category": "File Analysis",
        })

    _update_scan_result(db, scan, raw_findings)

    return {
        "scan_id": scan.id,
        "scan_uid": scan_id,
        "status": "COMPLETED",
        "findings_count": len(raw_findings),
        "risk_score": scan.risk_score,
    }


@router.post("/source-code")
async def submit_source_code_scan(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scan_id = generate_scan_id(db)
    scan = Scan(
        scan_id=scan_id,
        user_id=current_user.id,
        type=ScanType.source_code,
        target=file.filename or "source_code.zip",
        status=ScanStatus.analyzing,
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    # Save uploaded file to temp location
    with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        scanner = SourceCodeScanner()
        result = await scanner.scan(tmp_path)
    except Exception as e:
        result = {"findings": [], "errors": [str(e)]}
    finally:
        os.unlink(tmp_path)

    raw_findings = result.get("findings", [])
    _update_scan_result(db, scan, raw_findings)

    return {
        "scan_id": scan.id,
        "scan_uid": scan_id,
        "status": "COMPLETED",
        "findings_count": len(raw_findings),
        "risk_score": scan.risk_score,
    }


@router.get("")
def list_scans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    scans = db.query(Scan).filter(Scan.user_id == current_user.id).order_by(Scan.submitted_at.desc()).all()
    return [
        {
            "id": s.id, "scan_id": s.scan_id, "type": s.type.value, "target": s.target,
            "status": s.status.value, "risk_score": s.risk_score, "risk_level": s.risk_level,
            "verdict": s.verdict.value,
            "findings_count": {
                "critical": s.findings_count_critical, "high": s.findings_count_high,
                "medium": s.findings_count_medium, "low": s.findings_count_low,
                "info": s.findings_count_info,
            },
            "submitted_at": s.submitted_at, "completed_at": s.completed_at, "is_demo": bool(s.is_demo),
        }
        for s in scans
    ]


@router.get("/{scan_db_id}")
def get_scan(scan_db_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scan = db.query(Scan).filter(Scan.id == scan_db_id, Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    findings = db.query(ScanFinding).filter(ScanFinding.scan_id == scan.id).all()
    timeline = db.query(ScanTimeline).filter(ScanTimeline.scan_id == scan.id).order_by(ScanTimeline.timestamp).all()

    return {
        "scan": {
            "id": scan.id, "scan_id": scan.scan_id, "type": scan.type.value, "target": scan.target,
            "status": scan.status.value, "risk_score": scan.risk_score, "risk_level": scan.risk_level,
            "verdict": scan.verdict.value,
            "findings_count": {
                "critical": scan.findings_count_critical, "high": scan.findings_count_high,
                "medium": scan.findings_count_medium, "low": scan.findings_count_low,
                "info": scan.findings_count_info,
            },
            "submitted_at": scan.submitted_at, "completed_at": scan.completed_at,
            "is_demo": bool(scan.is_demo),
        },
        "findings": [
            {
                "id": f.id, "title": f.title, "severity": f.severity.value, "confidence": f.confidence,
                "description": f.description, "evidence": f.evidence, "location": f.location,
                "affected_component": f.affected_component, "impact": f.impact,
                "recommendation": f.recommendation, "category": f.category,
                "file_path": f.file_path, "line_number": f.line_number, "ai_explanation": f.ai_explanation,
            }
            for f in findings
        ],
        "timeline": [
            {"stage": t.stage, "timestamp": t.timestamp, "status": t.status}
            for t in timeline
        ],
    }


@router.post("/{scan_db_id}/rescan")
def rescan(scan_db_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    original = db.query(Scan).filter(Scan.id == scan_db_id, Scan.user_id == current_user.id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Scan not found")

    new_scan_id = generate_scan_id(db)
    scan = Scan(
        scan_id=new_scan_id,
        user_id=current_user.id,
        type=original.type,
        target=original.target,
        status=ScanStatus.queued,
    )
    db.add(scan)
    db.commit()
    return {"scan_id": new_scan_id, "status": "QUEUED", "message": "Rescan queued"}
