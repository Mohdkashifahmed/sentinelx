"""AI Analysis API routes."""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.models.scan import Scan
from app.models.report import AIAnalysis
from app.api.auth import get_current_user

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    scan_id: int


@router.get("/{scan_db_id}/analysis")
def get_ai_analysis(scan_db_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    scan = db.query(Scan).filter(Scan.id == scan_db_id, Scan.user_id == current_user.id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    analysis = db.query(AIAnalysis).filter(AIAnalysis.scan_id == scan.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="AI analysis not yet available")

    return {
        "id": analysis.id,
        "scan_id": analysis.scan_id,
        "threat_explanation": analysis.threat_explanation,
        "risk_summary": analysis.risk_summary,
        "remediation_steps": analysis.remediation_steps,
        "code_review": analysis.code_review,
        "false_positive_assessment": analysis.false_positive_assessment,
        "final_recommendation": analysis.final_recommendation,
        "generated_at": analysis.generated_at,
    }


@router.post("/chat")
def ai_chat(request: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """AI Security Chat - responds based on scan findings."""
    scan = db.query(Scan).filter(Scan.id == request.scan_id).first()

    # In production, this would call an LLM API with scan context
    response = {
        "role": "assistant",
        "content": f"Based on the scan analysis of {scan.target if scan else 'your target'}, "
                   "I can help you understand the findings. The security engine has identified "
                   "several areas of concern that are detailed in the scan report.",
        "sources": ["Security Engine Analysis", "AI Threat Assessment"],
        "timestamp": datetime.utcnow().isoformat(),
    }

    return response
