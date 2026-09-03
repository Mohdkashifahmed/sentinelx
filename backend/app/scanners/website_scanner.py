"""Website security scanner - analyzes URLs for security threats."""
from typing import List, Dict
import httpx
from urllib.parse import urlparse


class WebsiteScanner:
    """Scans websites for security issues."""

    BLOCKED_HOSTS = {"localhost", "127.0.0.1", "0.0.0.0", "169.254.169.254"}

    def __init__(self):
        self.timeout = 15
        self.max_response_size = 5 * 1024 * 1024  # 5MB

    async def scan(self, url: str) -> Dict:
        """Perform a website security scan."""
        findings = []
        errors = []

        # Validate URL
        parsed = urlparse(url)
        if parsed.hostname in self.BLOCKED_HOSTS:
            return {"findings": [], "errors": ["Scanning localhost/internal hosts is not allowed"]}

        if parsed.scheme not in ("http", "https"):
            return {"findings": [], "errors": ["Only HTTP/HTTPS URLs are supported"]}

        try:
            async with httpx.AsyncClient(
                timeout=self.timeout,
                follow_redirects=True,
                max_redirects=5,
            ) as client:
                response = await client.get(url)
                headers = dict(response.headers)

                # Check SSL
                findings.extend(self._check_ssl(url, response))

                # Check security headers
                findings.extend(self._check_headers(headers))

                # Check redirects
                if len(response.history) > 2:
                    findings.append({
                        "title": "Multiple Redirects Detected",
                        "severity": "medium",
                        "confidence": 75,
                        "description": f"The URL redirects through {len(response.history)} hops.",
                        "evidence": f"Redirect chain: {' → '.join([str(r.url) for r in response.history])}",
                        "impact": "Multi-hop redirects may mask malicious destinations.",
                        "recommendation": "Review redirect chain for legitimacy.",
                        "category": "URL Analysis",
                    })

        except httpx.TimeoutException:
            errors.append("Target did not respond within the allowed timeout")
        except httpx.RequestError as e:
            errors.append(f"Connection error: {str(e)}")

        return {"findings": findings, "errors": errors}

    def _check_ssl(self, url: str, response) -> List[Dict]:
        findings = []
        if not url.startswith("https://"):
            findings.append({
                "title": "HTTPS Not Used",
                "severity": "medium",
                "confidence": 95,
                "description": "The website does not use HTTPS encryption.",
                "evidence": f"URL scheme: {urlparse(url).scheme}",
                "impact": "Data transmitted in plaintext can be intercepted.",
                "recommendation": "Implement HTTPS with a valid SSL certificate.",
                "category": "Transport Security",
            })
        return findings

    def _check_headers(self, headers: Dict) -> List[Dict]:
        findings = []
        security_headers = {
            "content-security-policy": ("Content-Security-Policy", "medium", "Helps prevent XSS attacks"),
            "x-frame-options": ("X-Frame-Options", "low", "Prevents clickjacking"),
            "x-content-type-options": ("X-Content-Type-Options", "low", "Prevents MIME sniffing"),
            "strict-transport-security": ("Strict-Transport-Security", "medium", "Enforces HTTPS"),
        }

        for header_key, (name, severity, desc) in security_headers.items():
            if header_key not in {k.lower() for k in headers}:
                findings.append({
                    "title": f"Missing {name} Header",
                    "severity": severity,
                    "confidence": 90,
                    "description": f"The server does not return a {name} header, which {desc}.",
                    "evidence": f"Header '{name}' not found in response.",
                    "impact": f"Without this header, the application is more vulnerable.",
                    "recommendation": f"Add '{name}' header to the server response.",
                    "category": "Security Headers",
                })

        # Check server header disclosure
        if "server" in {k.lower() for k in headers}:
            server_val = headers.get("server", "")
            findings.append({
                "title": "Server Version Disclosure",
                "severity": "info",
                "confidence": 95,
                "description": "The server header reveals the web server version.",
                "evidence": f"Server: {server_val}",
                "impact": "Attackers can use version info to find known vulnerabilities.",
                "recommendation": "Remove or obfuscate the Server header.",
                "category": "Information Disclosure",
            })

        return findings
