"""Report and AI Analysis models."""
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), unique=True, nullable=False)
    title = Column(String, nullable=False)
    executive_summary = Column(Text, nullable=False)
    overall_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    verdict = Column(String, nullable=False)
    remediation_plan = Column(JSON, nullable=True)
    final_recommendation = Column(Text, nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="report")


class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), unique=True, nullable=False)
    threat_explanation = Column(Text, nullable=False)
    risk_summary = Column(Text, nullable=False)
    remediation_steps = Column(JSON, nullable=True)
    code_review = Column(Text, nullable=True)
    false_positive_assessment = Column(Text, nullable=True)
    final_recommendation = Column(Text, nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="ai_analysis")
