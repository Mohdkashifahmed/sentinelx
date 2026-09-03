"""Analyst case and note models."""
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class CaseStatus(str, enum.Enum):
    new = "NEW"
    investigating = "INVESTIGATING"
    escalated = "ESCALATED"
    resolved = "RESOLVED"
    false_positive = "FALSE_POSITIVE"


class AnalystCase(Base):
    __tablename__ = "analyst_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, unique=True, index=True, nullable=False)
    scan_id = Column(String, nullable=False)
    target = Column(String, nullable=False)
    risk_score = Column(Integer, nullable=False)
    severity = Column(String, nullable=False)
    assigned_analyst = Column(String, nullable=False)
    status = Column(SQLEnum(CaseStatus), default=CaseStatus.new)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    notes = relationship("AnalystNote", back_populates="case", order_by="AnalystNote.timestamp")


class AnalystNote(Base):
    __tablename__ = "analyst_notes"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("analyst_cases.id"), nullable=False)
    author = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    case = relationship("AnalystCase", back_populates="notes")
