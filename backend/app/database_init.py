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


def _add_findings(db, scan_pk: int, findings_data: list):
    """Add findings for a scan."""
    for f in findings_data:
        sev = f.get("severity", "info")
        try:
            severity = Severity(sev)
        except ValueError:
            severity = Severity.info
        db.add(ScanFinding(
            scan_id=scan_pk,
            title=f["title"],
            severity=severity,
            confidence=f.get("confidence", 85),
            description=f["description"],
            evidence=f["evidence"],
            location=f.get("location"),
            affected_component=f.get("affected_component"),
            impact=f["impact"],
            recommendation=f["recommendation"],
            category=f.get("category", "Security"),
            file_path=f.get("file_path"),
            line_number=f.get("line_number"),
            ai_explanation=f.get("ai_explanation"),
        ))


def _add_timeline(db, scan_pk: int, base_time: datetime):
    """Add timeline events for a scan."""
    stages = [
        ("Submitted", 0), ("Validation", 3), ("Security Analysis", 12),
        ("Threat Detection", 65), ("Risk Calculation", 13), ("AI Analysis", 12),
        ("Report Generation", 52), ("Completed", 20),
    ]
    offset = timedelta()
    for stage_name, seconds in stages:
        offset += timedelta(seconds=seconds)
        db.add(ScanTimeline(scan_id=scan_pk, stage=stage_name, timestamp=base_time + offset, status="completed"))


def seed_demo_data():
    """Seed database with demo data."""
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            return

        # --- Users ---
        users = [
            User(email="user@demo.com", name="Alex Morgan", hashed_password=pwd_context.hash("demo123"), role=UserRole.user, created_at=datetime(2026, 1, 15), last_login=datetime(2026, 9, 3, 7, 0)),
            User(email="analyst@demo.com", name="Sarah Chen", hashed_password=pwd_context.hash("demo123"), role=UserRole.analyst, created_at=datetime(2025, 11, 20), last_login=datetime(2026, 9, 2, 8, 30)),
            User(email="admin@demo.com", name="Marcus Webb", hashed_password=pwd_context.hash("demo123"), role=UserRole.admin, created_at=datetime(2025, 9, 1), last_login=datetime(2026, 9, 3, 6, 45)),
        ]
        db.add_all(users)
        db.flush()  # get IDs without committing

        # --- Scans ---
        scans = [
            Scan(scan_id="SCAN-20260903-00001", user_id=users[0].id, type=ScanType.website, target="https://example-safe.com", status=ScanStatus.completed, risk_score=12, risk_level="LOW", verdict=Verdict.low_risk, findings_count_critical=0, findings_count_high=0, findings_count_medium=1, findings_count_low=3, findings_count_info=5, submitted_at=datetime(2026, 9, 3, 8, 15), completed_at=datetime(2026, 9, 3, 8, 17, 42), is_demo=1),
            Scan(scan_id="SCAN-20260902-00002", user_id=users[0].id, type=ScanType.website, target="https://suspicious-login.example.net", status=ScanStatus.completed, risk_score=72, risk_level="HIGH", verdict=Verdict.suspicious, findings_count_critical=1, findings_count_high=3, findings_count_medium=4, findings_count_low=2, findings_count_info=3, submitted_at=datetime(2026, 9, 2, 14, 22), completed_at=datetime(2026, 9, 2, 14, 26, 18), is_demo=1),
            Scan(scan_id="SCAN-20260901-00003", user_id=users[0].id, type=ScanType.file, target="suspicious-toolkit-v3.zip", status=ScanStatus.completed, risk_score=89, risk_level="CRITICAL", verdict=Verdict.critical, findings_count_critical=3, findings_count_high=4, findings_count_medium=2, findings_count_low=1, findings_count_info=4, submitted_at=datetime(2026, 9, 1, 11, 5), completed_at=datetime(2026, 9, 1, 11, 12, 33), is_demo=1),
            Scan(scan_id="SCAN-20260831-00004", user_id=users[0].id, type=ScanType.source_code, target="webapp-project-main.zip", status=ScanStatus.completed, risk_score=45, risk_level="ELEVATED", verdict=Verdict.moderate, findings_count_critical=0, findings_count_high=2, findings_count_medium=5, findings_count_low=6, findings_count_info=8, submitted_at=datetime(2026, 8, 31, 9, 30), completed_at=datetime(2026, 8, 31, 9, 35, 17), is_demo=1),
        ]
        db.add_all(scans)
        db.flush()  # get scan IDs

        # === SCAN 1: example-safe.com ===
        _add_findings(db, scans[0].id, [
            {"title": "Missing Content-Security-Policy Header", "severity": "medium", "confidence": 85, "description": "The server does not return a Content-Security-Policy header, which helps prevent XSS attacks.", "evidence": "HTTP header 'Content-Security-Policy' not found in response.", "location": "HTTP Response Headers", "affected_component": "Web Server Configuration", "impact": "Potential exposure to cross-site scripting attacks.", "recommendation": "Implement a Content-Security-Policy header with appropriate directives.", "category": "Security Headers", "ai_explanation": "Without CSP, the browser cannot restrict which scripts can execute on the page."},
            {"title": "HTTP to HTTPS Redirect Not Enforced", "severity": "low", "confidence": 90, "description": "The HTTP version of the site does not redirect to HTTPS.", "evidence": "HTTP request returned 200 OK without redirect.", "location": "HTTP Redirect", "affected_component": "Web Server", "impact": "Users may access the site over an unencrypted connection.", "recommendation": "Configure a 301 redirect from HTTP to HTTPS.", "category": "Transport Security"},
            {"title": "X-Frame-Options Header Missing", "severity": "low", "confidence": 88, "description": "The response does not include X-Frame-Options, allowing potential clickjacking.", "evidence": "Header 'X-Frame-Options' absent from HTTP response.", "location": "HTTP Response Headers", "affected_component": "Web Server", "impact": "The site could be embedded in malicious iframes for clickjacking.", "recommendation": "Add 'X-Frame-Options: DENY' or 'SAMEORIGIN' header.", "category": "Security Headers"},
            {"title": "Server Version Disclosure", "severity": "info", "confidence": 95, "description": "The server header reveals the web server version.", "evidence": "Server: nginx/1.24.0", "location": "HTTP Response Headers", "affected_component": "Web Server", "impact": "Attackers can use version info to find known vulnerabilities.", "recommendation": "Remove or obfuscate the Server header.", "category": "Information Disclosure"},
        ])
        _add_timeline(db, scans[0].id, datetime(2026, 9, 3, 8, 15))

        # === SCAN 2: suspicious-login.example.net ===
        _add_findings(db, scans[1].id, [
            {"title": "Credential Harvesting Form Detected", "severity": "critical", "confidence": 92, "description": "The page contains a login form that submits credentials to an external, unrelated domain.", "evidence": "Form action: https://login-verify.example.net/auth/collect", "location": "HTML Form", "affected_component": "Login Page", "impact": "User credentials may be stolen via phishing.", "recommendation": "Investigate and remove unauthorized credential collection forms.", "category": "Phishing", "ai_explanation": "This is a strong indicator of a credential harvesting attack."},
            {"title": "Obfuscated JavaScript Detected", "severity": "high", "confidence": 87, "description": "JavaScript on the page uses heavy obfuscation techniques commonly associated with malicious code.", "evidence": "eval(atob(\"...\")) pattern found in inline script block.", "location": "JavaScript", "affected_component": "Client-Side Scripts", "impact": "Obfuscated code may execute malicious payloads.", "recommendation": "Deobfuscate and review the script content.", "category": "Malicious Scripts"},
            {"title": "External Resource from Suspicious Domain", "severity": "high", "confidence": 78, "description": "The page loads resources from a recently registered, low-reputation domain.", "evidence": "Script src: https://cdn-trust-static.xyz/analytics.js (registered 3 days ago)", "location": "External Resource", "affected_component": "Third-Party Scripts", "impact": "Resource may deliver malicious code.", "recommendation": "Remove or replace the external resource.", "category": "External Resources"},
            {"title": "Suspicious Redirect Chain", "severity": "high", "confidence": 82, "description": "The URL redirects through multiple unrelated domains before reaching the final page.", "evidence": "Redirect chain: / -> verify.login.example.net -> suspicious-login.example.net (3 hops)", "location": "HTTP Redirects", "affected_component": "URL Handling", "impact": "Multi-hop redirects can mask malicious destinations.", "recommendation": "Remove unnecessary redirects.", "category": "URL Analysis"},
            {"title": "Missing Security Headers", "severity": "medium", "confidence": 85, "description": "Multiple security headers are absent from the server response.", "evidence": "Missing: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy", "location": "HTTP Response", "affected_component": "Web Server", "impact": "Increased vulnerability to various web attacks.", "recommendation": "Implement all recommended security headers.", "category": "Security Headers"},
        ])
        _add_timeline(db, scans[1].id, datetime(2026, 9, 2, 14, 22))

        # === SCAN 3: suspicious-toolkit-v3.zip ===
        _add_findings(db, scans[2].id, [
            {"title": "Embedded Remote Access Tool", "severity": "critical", "confidence": 94, "description": "The archive contains a fully functional remote access trojan (RAT).", "evidence": "File: toolkit/bin/rat_client.exe - matches known RAT signature", "location": "Archived File", "affected_component": "Embedded Binary", "impact": "Full remote control of compromised systems.", "recommendation": "Do not execute. Delete the archive and scan all systems.", "category": "Malware"},
            {"title": "Credential Stealer Script", "severity": "critical", "confidence": 91, "description": "A Python script designed to extract saved browser credentials was found.", "evidence": "File: toolkit/scripts/cred_dump.py - extracts Chrome/Saved passwords via DPAPI", "location": "Archived File", "affected_component": "Embedded Script", "impact": "User passwords and credentials could be stolen.", "recommendation": "Remove script. Rotate any potentially compromised credentials.", "category": "Malware"},
            {"title": "Persistence Mechanism", "severity": "critical", "confidence": 88, "description": "The archive includes scripts that establish persistence via registry modification.", "evidence": "File: toolkit/setup.bat - adds registry Run entry", "location": "Archived File", "affected_component": "Setup Script", "impact": "Malicious code will run automatically on system startup.", "recommendation": "Do not run setup scripts from untrusted sources.", "category": "Malware"},
            {"title": "Network Exfiltration Endpoints", "severity": "high", "confidence": 85, "description": "Multiple hardcoded C2 server addresses found in the archive.", "evidence": "IPs: 185.234.xx.xx:443, 91.215.xx.xx:8080 - found in config.json", "location": "Configuration Files", "affected_component": "C2 Configuration", "impact": "Data exfiltration to attacker-controlled servers.", "recommendation": "Block the identified IP addresses at the network perimeter.", "category": "Network Indicators"},
        ])
        _add_timeline(db, scans[2].id, datetime(2026, 9, 1, 11, 5))

        # === SCAN 4: webapp-project-main.zip ===
        _add_findings(db, scans[3].id, [
            {"title": "Hardcoded Database Credentials", "severity": "high", "confidence": 96, "description": "Database credentials are hardcoded directly in the application source code.", "evidence": "config/database.py:18 - DB_PASSWORD = \"s3cretP@ss!\"", "location": "config/database.py:18", "affected_component": "Database Configuration", "impact": "Credentials exposed in source code can be leaked via repositories or logs.", "recommendation": "Move credentials to environment variables.", "ai_explanation": "Hardcoded credentials are a common source of data breaches.", "category": "Secrets Exposure", "file_path": "config/database.py", "line_number": 18},
            {"title": "SQL Injection Vulnerability", "severity": "critical", "confidence": 93, "description": "User input is directly interpolated into SQL queries without parameterization.", "evidence": "app/models/user.py:42 - cursor.execute(f\"SELECT * FROM users WHERE id={user_id}\")", "location": "app/models/user.py:42", "affected_component": "User Model", "impact": "Attackers can execute arbitrary SQL commands.", "recommendation": "Use parameterized queries or an ORM.", "ai_explanation": "This is one of the most dangerous web vulnerabilities.", "category": "Injection", "file_path": "app/models/user.py", "line_number": 42},
            {"title": "Command Injection via subprocess", "severity": "critical", "confidence": 90, "description": "User-controlled input is passed to subprocess without sanitization.", "evidence": "app/utils/processor.py:67 - subprocess.run(f\"convert {filename} output.png\", shell=True)", "location": "app/utils/processor.py:67", "affected_component": "File Processor", "impact": "Attackers can execute arbitrary system commands.", "recommendation": "Use subprocess with a list of arguments and shell=False.", "category": "Injection", "file_path": "app/utils/processor.py", "line_number": 67},
            {"title": "Debug Mode Enabled in Production", "severity": "high", "confidence": 95, "description": "The application has DEBUG=True in its settings.", "evidence": "settings.py:12 - DEBUG = True", "location": "settings.py:12", "affected_component": "Application Settings", "impact": "Detailed error messages and stack traces are visible.", "recommendation": "Set DEBUG=False in production.", "category": "Configuration", "file_path": "settings.py", "line_number": 12},
            {"title": "Weak Password Hashing", "severity": "high", "confidence": 88, "description": "Passwords are hashed with MD5, which is cryptographically broken.", "evidence": "app/auth/handler.py:23 - hashlib.md5(password.encode()).hexdigest()", "location": "app/auth/handler.py:23", "affected_component": "Authentication Module", "impact": "Compromised password hashes can be cracked rapidly.", "recommendation": "Use bcrypt, scrypt, or argon2 for password hashing.", "category": "Cryptography", "file_path": "app/auth/handler.py", "line_number": 23},
        ])
        _add_timeline(db, scans[3].id, datetime(2026, 8, 31, 9, 30))

        # --- Analyst Cases ---
        cases = [
            AnalystCase(case_id="CASE-2026-0042", scan_id="SCAN-20260902-00002", target="suspicious-login.example.net", risk_score=72, severity="high", assigned_analyst="Sarah Chen", status=CaseStatus.investigating, created_at=datetime(2026, 9, 2, 15, 0), updated_at=datetime(2026, 9, 3, 9, 15)),
            AnalystCase(case_id="CASE-2026-0041", scan_id="SCAN-20260901-00003", target="suspicious-toolkit-v3.zip", risk_score=89, severity="critical", assigned_analyst="James Wright", status=CaseStatus.escalated, created_at=datetime(2026, 9, 1, 11, 30), updated_at=datetime(2026, 9, 2, 10, 0)),
        ]
        db.add_all(cases)
        db.flush()

        # --- Analyst Notes ---
        db.add(AnalystNote(case_id=cases[0].id, author="Sarah Chen", content="Initial analysis confirms phishing indicators. Credential harvesting form verified.", timestamp=datetime(2026, 9, 2, 16, 0)))
        db.add(AnalystNote(case_id=cases[0].id, author="Sarah Chen", content="Cross-referencing with known phishing kits. Matches pattern from Q3 campaign.", timestamp=datetime(2026, 9, 3, 9, 15)))
        db.add(AnalystNote(case_id=cases[1].id, author="James Wright", content="Malware confirmed. RAT + credential stealer + persistence mechanism.", timestamp=datetime(2026, 9, 1, 14, 0)))
        db.add(AnalystNote(case_id=cases[1].id, author="Marcus Webb", content="Escalated to incident response team. C2 IPs added to blocklist.", timestamp=datetime(2026, 9, 2, 10, 0)))

        # --- Single commit for everything ---
        db.commit()
        print("[OK] Database initialized and demo data seeded.")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    seed_demo_data()
