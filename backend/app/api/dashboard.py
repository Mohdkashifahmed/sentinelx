"""Dashboard API route."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user import User
from app.models.scan import Scan
from app.api.auth import get_current_user

router = APIRouter()


@router.get("")
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scans = db.query(Scan).filter(Scan.user_id == current_user.id).all()
    completed = [s for s in scans if s.status.value == "COMPLETED"]

    return {
        "total_scans": len(completed),
        "safe": len([s for s in completed if s.verdict.value in ("SAFE", "LOW_RISK")]),
        "suspicious": len([s for s in completed if s.verdict.value == "SUSPICIOUS"]),
        "high_risk": len([s for s in completed if s.verdict.value == "HIGH_RISK"]),
        "critical": len([s for s in completed if s.verdict.value == "CRITICAL"]),
    }
