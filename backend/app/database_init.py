"""Initialize database tables and seed demo data."""
from datetime import datetime, timedelta
from app.database import engine, Base, SessionLocal
from app.models import User, Scan, ScanFinding, ScanTimeline, Report, AIAnalysis, AnalystCase, AnalystNote, Notification, AuditLog
from app.models.user import UserRole
from app.models.scan import ScanType, ScanStatus, Verdict, Severity
from app.models.analyst import CaseStatus
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def init_db():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)


def seed_demo_data():
    """Seed database with demo data."""
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(User).count() > 0:
            return

        # Create demo users
        users = [
            User(email="user@demo.com", name="Alex Morgan", hashed_password=pwd_context.hash("demo123"), role=UserRole.user, created_at=datetime(2026, 1, 15), last_login=datetime(2026, 9, 3, 7, 0)),
            User(email="analyst@demo.com", name="Sarah Chen", hashed_password=pwd_context.hash("demo123"), role=UserRole.analyst, created_at=datetime(2025, 11, 20), last_login=datetime(2026, 9, 2, 8, 30)),
            User(email="admin@demo.com", name="Marcus Webb", hashed_password=pwd_context.hash("demo123"), role=UserRole.admin, created_at=datetime(2025, 9, 1), last_login=datetime(2026, 9, 3, 6, 45)),
        ]
        db.add_all(users)
        db.commit()

        # Create demo scans
        scans = [
            Scan(scan_id="SCAN-20260903-00001", user_id=1, type=ScanType.website, target="https://example-safe.com", status=ScanStatus.completed, risk_score=12, risk_level="LOW", verdict=Verdict.low_risk, findings_count_critical=0, findings_count_high=0, findings_count_medium=1, findings_count_low=3, findings_count_info=5, submitted_at=datetime(2026, 9, 3, 8, 15), completed_at=datetime(2026, 9, 3, 8, 17, 42), is_demo=1),
            Scan(scan_id="SCAN-20260902-00002", user_id=1, type=ScanType.website, target="https://suspicious-login.example.net", status=ScanStatus.completed, risk_score=72, risk_level="HIGH", verdict=Verdict.suspicious, findings_count_critical=1, findings_count_high=3, findings_count_medium=4, findings_count_low=2, findings_count_info=3, submitted_at=datetime(2026, 9, 2, 14, 22), completed_at=datetime(2026, 9, 2, 14, 26, 18), is_demo=1),
            Scan(scan_id="SCAN-20260901-00003", user_id=1, type=ScanType.file, target="suspicious-toolkit-v3.zip", status=ScanStatus.completed, risk_score=89, risk_level="CRITICAL", verdict=Verdict.critical, findings_count_critical=3, findings_count_high=4, findings_count_medium=2, findings_count_low=1, findings_count_info=4, submitted_at=datetime(2026, 9, 1, 11, 5), completed_at=datetime(2026, 9, 1, 11, 12, 33), is_demo=1),
            Scan(scan_id="SCAN-20260831-00004", user_id=1, type=ScanType.source_code, target="webapp-project-main.zip", status=ScanStatus.completed, risk_score=45, risk_level="ELEVATED", verdict=Verdict.moderate, findings_count_critical=0, findings_count_high=2, findings_count_medium=5, findings_count_low=6, findings_count_info=8, submitted_at=datetime(2026, 8, 31, 9, 30), completed_at=datetime(2026, 8, 31, 9, 35, 17), is_demo=1),
        ]
        db.add_all(scans)
        db.commit()

        # Create demo analyst cases
        cases = [
            AnalystCase(case_id="CASE-2026-0042", scan_id="SCAN-20260902-00002", target="suspicious-login.example.net", risk_score=72, severity="high", assigned_analyst="Sarah Chen", status=CaseStatus.investigating, created_at=datetime(2026, 9, 2, 15, 0), updated_at=datetime(2026, 9, 3, 9, 15)),
            AnalystCase(case_id="CASE-2026-0041", scan_id="SCAN-20260901-00003", target="suspicious-toolkit-v3.zip", risk_score=89, severity="critical", assigned_analyst="James Wright", status=CaseStatus.escalated, created_at=datetime(2026, 9, 1, 11, 30), updated_at=datetime(2026, 9, 2, 10, 0)),
        ]
        db.add_all(cases)
        db.commit()

        print("[OK] Database initialized and demo data seeded.")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    seed_demo_data()
