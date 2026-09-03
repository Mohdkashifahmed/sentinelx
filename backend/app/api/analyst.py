"""Analyst API routes."""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.user import User, UserRole
from app.models.analyst import AnalystCase, AnalystNote, CaseStatus
from app.api.auth import get_current_user

router = APIRouter()


class CaseUpdateRequest(BaseModel):
    status: str


class NoteRequest(BaseModel):
    content: str


def require_analyst(user: User = Depends(get_current_user)):
    if user.role not in (UserRole.analyst, UserRole.admin):
        raise HTTPException(status_code=403, detail="Analyst access required")
    return user


@router.get("/cases")
def list_cases(db: Session = Depends(get_db), current_user: User = Depends(require_analyst)):
    cases = db.query(AnalystCase).order_by(AnalystCase.created_at.desc()).all()
    return [
        {
            "id": c.id, "case_id": c.case_id, "scan_id": c.scan_id, "target": c.target,
            "risk_score": c.risk_score, "severity": c.severity, "assigned_analyst": c.assigned_analyst,
            "status": c.status.value, "created_at": c.created_at, "updated_at": c.updated_at,
            "notes_count": len(c.notes),
        }
        for c in cases
    ]


@router.get("/cases/{case_db_id}")
def get_case(case_db_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_analyst)):
    case = db.query(AnalystCase).filter(AnalystCase.id == case_db_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    return {
        "id": case.id, "case_id": case.case_id, "scan_id": case.scan_id, "target": case.target,
        "risk_score": case.risk_score, "severity": case.severity,
        "assigned_analyst": case.assigned_analyst, "status": case.status.value,
        "created_at": case.created_at, "updated_at": case.updated_at,
        "notes": [
            {"id": n.id, "author": n.author, "content": n.content, "timestamp": n.timestamp}
            for n in case.notes
        ],
    }


@router.patch("/cases/{case_db_id}")
def update_case(case_db_id: int, request: CaseUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(require_analyst)):
    case = db.query(AnalystCase).filter(AnalystCase.id == case_db_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    case.status = CaseStatus(request.status)
    case.updated_at = datetime.utcnow()
    db.commit()
    return {"status": "updated", "new_status": case.status.value}


@router.post("/cases/{case_db_id}/notes")
def add_note(case_db_id: int, request: NoteRequest, db: Session = Depends(get_db), current_user: User = Depends(require_analyst)):
    case = db.query(AnalystCase).filter(AnalystCase.id == case_db_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    note = AnalystNote(
        case_id=case.id,
        author=current_user.name,
        content=request.content,
    )
    db.add(note)
    case.updated_at = datetime.utcnow()
    db.commit()
    return {"status": "added", "note_id": note.id}
