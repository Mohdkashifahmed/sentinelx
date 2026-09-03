"""Notifications API route."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.notification import Notification
from app.api.auth import get_current_user

router = APIRouter()


@router.get("")
def list_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notifications = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )
    return [
        {
            "id": n.id, "type": n.type, "title": n.title, "message": n.message,
            "read": bool(n.read), "scan_id": n.scan_id, "created_at": n.created_at,
        }
        for n in notifications
    ]


@router.patch("/{notification_id}/read")
def mark_read(notification_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notif = db.query(Notification).filter(
        Notification.id == notification_id, Notification.user_id == current_user.id
    ).first()
    if notif:
        notif.read = 1
        db.commit()
    return {"status": "updated"}


@router.post("/read-all")
def mark_all_read(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db.query(Notification).filter(
        Notification.user_id == current_user.id, Notification.read == 0
    ).update({"read": 1})
    db.commit()
    return {"status": "updated"}
