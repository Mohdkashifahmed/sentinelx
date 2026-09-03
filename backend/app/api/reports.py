"""Reports API route."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.scan import Scan
from app.models.report import Report
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/{scan_db_id}/report")
def get_report(scan_db_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scan = db.query(Scan).filter(Scan.id == scan_db_id, Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    report = db.query(Report).filter(Report.scan_id == scan.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not yet generated")

    return {
        "id": report.id,
        "scan_id": report.scan_id,
        "title": report.title,
        "executive_summary": report.executive_summary,
        "overall_score": report.overall_score,
        "risk_level": report.risk_level,
        "verdict": report.verdict,
        "remediation_plan": report.remediation_plan,
        "final_recommendation": report.final_recommendation,
        "generated_at": report.generated_at,
    }
