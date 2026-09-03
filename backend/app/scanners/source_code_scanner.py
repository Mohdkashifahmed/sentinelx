"""Source code security scanner - detects vulnerabilities in source code."""
import re
import os
from typing import Dict, List


class SourceCodeScanner:
    """Scans source code for security vulnerabilities."""

    VULNERABILITY_PATTERNS = [
        {
            "pattern": r'(password|passwd|pwd|secret|api_key|apikey|token)\s*[=:]\s*["\'][^"\']+["\']',
            "title": "Hardcoded Secret Detected",
            "severity": "critical",
            "confidence": 95,
            "category": "Secrets Exposure",
            "description": "A hardcoded credential or secret was found in the source code.",
            "impact": "Credentials in source code can be leaked through repositories or logs.",
            "recommendation": "Move credentials to environment variables and rotate exposed secrets.",
        },
        {
            "pattern": r'f["\'].*SELECT.*FROM.*{.*}',
            "title": "Potential SQL Injection",
            "severity": "critical",
            "confidence": 90,
            "category": "Injection",
            "description": "User input appears to be directly interpolated into a SQL query.",
            "impact": "Attackers can execute arbitrary SQL commands.",
            "recommendation": "Use parameterized queries or an ORM.",
        },
        {
            "pattern": r'subprocess\.run\(f["\']|os\.system\(|os\.popen\(',
            "title": "Command Injection Risk",
            "severity": "critical",
            "confidence": 85,
            "category": "Injection",
            "description": "User-controlled input may be passed to system commands.",
            "impact": "Attackers can execute arbitrary system commands.",
            "recommendation": "Use subprocess with argument lists and shell=False.",
        },
        {
            "pattern": r'hashlib\.md5\(|hashlib\.sha1\(',
            "title": "Weak Hash Algorithm",
            "severity": "high",
            "confidence": 88,
            "category": "Cryptography",
            "description": "A cryptographically weak hash algorithm is being used.",
            "impact": "Weak hashes can be reversed or collided.",
            "recommendation": "Use bcrypt, scrypt, or argon2 for password hashing.",
        },
        {
            "pattern": r'DEBUG\s*=\s*True|debug\s*=\s*true',
            "title": "Debug Mode Enabled",
            "severity": "high",
            "confidence": 95,
            "category": "Configuration",
            "description": "Debug mode is enabled, which exposes detailed error pages.",
            "impact": "Stack traces and sensitive information may be visible.",
            "recommendation": "Disable debug mode in production.",
        },
        {
            "pattern": r'eval\(|exec\(',
            "title": "Dangerous Function Usage",
            "severity": "high",
            "confidence": 80,
            "category": "Code Execution",
            "description": "Use of eval() or exec() which can execute arbitrary code.",
            "impact": "These functions can be exploited for code injection.",
            "recommendation": "Avoid eval/exec. Use safer alternatives.",
        },
    ]

    async def scan(self, file_path: str) -> Dict:
        findings = []

        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()

        content = "".join(lines)

        for vuln in self.VULNERABILITY_PATTERNS:
            for i, line in enumerate(lines, 1):
                if re.search(vuln["pattern"], line, re.IGNORECASE):
                    findings.append({
                        "title": vuln["title"],
                        "severity": vuln["severity"],
                        "confidence": vuln["confidence"],
                        "description": vuln["description"],
                        "evidence": f"Line {i}: {line.strip()[:100]}",
                        "impact": vuln["impact"],
                        "recommendation": vuln["recommendation"],
                        "category": vuln["category"],
                        "file_path": os.path.basename(file_path),
                        "line_number": i,
                    })

        return {"findings": findings, "errors": [], "files_scanned": 1}
