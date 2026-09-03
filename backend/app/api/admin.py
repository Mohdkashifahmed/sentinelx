"""Admin API routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.user import User, UserRole
from app.models.scan import Scan
from app.models.audit import AuditLog
from app.api.auth import get_current_user

router = APIRouter()


class UserUpdateRequest(BaseModel):
    role: Optional[str] = None
    is_active: Optional[int] = None


def require_admin(user: User = Depends(get_current_user)):
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


@router.get("/users")
def list_users(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    users = db.query(User).all()
    return [
        {
            "id": u.id, "email": u.email, "name": u.name, "role": u.role.value,
            "is_active": u.is_active, "created_at": u.created_at, "last_login": u.last_login,
        }
        for u in users
    ]


@router.patch("/users/{user_id}")
def update_user(user_id: int, request: UserUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if request.role:
        user.role = UserRole(request.role)
    if request.is_active is not None:
        user.is_active = request.is_active
    db.commit()
    return {"status": "updated"}


@router.get("/statistics")
def get_statistics(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    from datetime import datetime, timedelta
    today = datetime.utcnow().date()

    total_users = db.query(User).filter(User.role == UserRole.user).count()
    total_analysts = db.query(User).filter(User.role == UserRole.analyst).count()
    total_scans = db.query(Scan).count()
    scans_today = db.query(Scan).filter(func.date(Scan.submitted_at) == today).count()

    return {
        "total_users": total_users,
        "total_analysts": total_analysts,
        "total_scans": total_scans,
        "scans_today": scans_today,
        "critical_threats": db.query(Scan).filter(Scan.verdict == "CRITICAL").count(),
        "system_health": "operational",
    }


@router.get("/audit-logs")
def get_audit_logs(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(50).all()
    return [
        {
            "id": l.id, "user": l.user.name if l.user else "System",
            "action": l.action, "target": l.target, "result": l.result,
            "ip_address": l.ip_address, "timestamp": l.timestamp,
        }
        for l in logs
    ]
