"""Scan API routes."""
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.models.scan import Scan, ScanFinding, ScanTimeline, ScanStatus, ScanType, Verdict
from app.api.auth import get_current_user
from app.services.risk_engine import calculate_risk_score

router = APIRouter()


class WebsiteScanRequest(BaseModel):
    url: str


class ScanResponse(BaseModel):
    id: int
    scan_id: str
    type: str
    target: str
    status: str
    risk_score: int
    risk_level: str
    verdict: str
    findings_count: dict
    submitted_at: datetime
    completed_at: Optional[datetime]
    is_demo: bool

    class Config:
        from_attributes = True


class FindingResponse(BaseModel):
    id: int
    title: str
    severity: str
    confidence: int
    description: str
    evidence: str
    location: Optional[str]
    affected_component: Optional[str]
    impact: str
    recommendation: str
    category: str
    file_path: Optional[str]
    line_number: Optional[int]
    ai_explanation: Optional[str]


def generate_scan_id(db: Session) -> str:
    today = datetime.utcnow().strftime("%Y%m%d")
    count = db.query(Scan).count() + 1
    return f"SCAN-{today[:4]}-{today[4:]}-{count:05d}"


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
        status=ScanStatus.queued,
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    # In production, this would trigger a background job
    # For now, return the scan object for polling
    return {"scan_id": scan_id, "status": "QUEUED", "message": "Scan queued for processing"}


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
        status=ScanStatus.queued,
    )
    db.add(scan)
    db.commit()
    return {"scan_id": scan_id, "status": "QUEUED", "message": "File scan queued"}


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
        status=ScanStatus.queued,
    )
    db.add(scan)
    db.commit()
    return {"scan_id": scan_id, "status": "QUEUED", "message": "Source code scan queued"}


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
