"""Scan and finding models."""
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class ScanType(str, enum.Enum):
    website = "website"
    file = "file"
    source_code = "source-code"


class ScanStatus(str, enum.Enum):
    queued = "QUEUED"
    validating = "VALIDATING"
    analyzing = "ANALYZING"
    ai_review = "AI_REVIEW"
    report_generation = "REPORT_GENERATION"
    completed = "COMPLETED"
    failed = "FAILED"


class Verdict(str, enum.Enum):
    safe = "SAFE"
    low_risk = "LOW_RISK"
    moderate = "MODERATE"
    suspicious = "SUSPICIOUS"
    high_risk = "HIGH_RISK"
    critical = "CRITICAL"


class Severity(str, enum.Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"
    info = "info"


class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(SQLEnum(ScanType), nullable=False)
    target = Column(String, nullable=False)
    status = Column(SQLEnum(ScanStatus), default=ScanStatus.queued)
    risk_score = Column(Integer, default=0)
    risk_level = Column(String, default="LOW")
    verdict = Column(SQLEnum(Verdict), default=Verdict.safe)
    findings_count_critical = Column(Integer, default=0)
    findings_count_high = Column(Integer, default=0)
    findings_count_medium = Column(Integer, default=0)
    findings_count_low = Column(Integer, default=0)
    findings_count_info = Column(Integer, default=0)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    is_demo = Column(Integer, default=0)

    user = relationship("User", back_populates="scans")
    findings = relationship("ScanFinding", back_populates="scan")
    timeline = relationship("ScanTimeline", back_populates="scan")
    report = relationship("Report", back_populates="scan", uselist=False)
    ai_analysis = relationship("AIAnalysis", back_populates="scan", uselist=False)


class ScanFinding(Base):
    __tablename__ = "scan_findings"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    title = Column(String, nullable=False)
    severity = Column(SQLEnum(Severity), nullable=False)
    confidence = Column(Integer, default=0)
    description = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    location = Column(String, nullable=True)
    affected_component = Column(String, nullable=True)
    impact = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    line_number = Column(Integer, nullable=True)
    ai_explanation = Column(Text, nullable=True)
    is_false_positive = Column(Integer, default=0)

    scan = relationship("Scan", back_populates="findings")


class ScanTimeline(Base):
    __tablename__ = "scan_events"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    stage = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="completed")

    scan = relationship("Scan", back_populates="timeline")
