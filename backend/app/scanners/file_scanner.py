"""File scanner - static analysis of uploaded files."""
import hashlib
import os
from typing import Dict, List


class FileScanner:
    """Performs static analysis on uploaded files."""

    DANGEROUS_EXTENSIONS = {".exe", ".scr", ".com", ".bat", ".cmd", ".ps1", ".vbs", ".js", ".wsf"}
    SUSPICIOUS_PATTERNS = [
        b"eval(", b"exec(", b"subprocess", b"os.system",
        b"powershell", b"cmd.exe", b"/bin/sh",
        b"base64", b"decode", b"eval(",
    ]

    async def scan(self, file_path: str, filename: str) -> Dict:
        findings = []
        metadata = {}

        # File metadata
        file_size = os.path.getsize(file_path)
        with open(file_path, "rb") as f:
            content = f.read()
            file_hash = hashlib.sha256(content).hexdigest()

        metadata = {
            "filename": filename,
            "size": file_size,
            "sha256": file_hash,
            "extension": os.path.splitext(filename)[1].lower(),
        }

        # Check dangerous extensions
        ext = metadata["extension"]
        if ext in self.DANGEROUS_EXTENSIONS:
            findings.append({
                "title": f"Executable File Detected ({ext})",
                "severity": "medium",
                "confidence": 85,
                "description": f"The file has a potentially dangerous extension ({ext}).",
                "evidence": f"File type: {ext}, Size: {file_size} bytes",
                "impact": "Executable files may contain malicious code.",
                "recommendation": "Only run files from trusted sources. Perform thorough analysis.",
                "category": "File Analysis",
            })

        # Check for suspicious strings
        for pattern in self.SUSPICIOUS_PATTERNS:
            if pattern in content:
                findings.append({
                    "title": f"Suspicious String Detected: {pattern.decode('utf-8', errors='ignore')}",
                    "severity": "medium",
                    "confidence": 60,
                    "description": f"The file contains the pattern '{pattern.decode('utf-8', errors='ignore')}' which may indicate suspicious behavior.",
                    "evidence": f"Pattern found in file content",
                    "impact": "Suspicious strings may indicate malicious intent.",
                    "recommendation": "Review the file context around this pattern.",
                    "category": "Malware Indicators",
                })

        # Check for embedded URLs
        try:
            text = content.decode("utf-8", errors="ignore")
            urls = [word for word in text.split() if word.startswith("http://") or word.startswith("https://")]
            if urls:
                findings.append({
                    "title": "Embedded URLs Detected",
                    "severity": "low",
                    "confidence": 70,
                    "description": f"The file contains {len(urls)} embedded URLs.",
                    "evidence": f"URLs found: {', '.join(urls[:5])}",
                    "impact": "Embedded URLs may be used for data exfiltration or C2 communication.",
                    "recommendation": "Review all embedded URLs for legitimacy.",
                    "category": "Network Indicators",
                })
        except Exception:
            pass

        return {"findings": findings, "metadata": metadata, "errors": []}
