"""Risk scoring engine - calculates risk scores based on technical findings."""
from typing import List, Dict

SEVERITY_WEIGHTS = {
    "critical": 20,
    "high": 12,
    "medium": 6,
    "low": 2,
    "info": 0.5,
}

SEVERITY_THRESHOLDS = {
    (0, 20): "LOW",
    (21, 40): "MODERATE",
    (41, 60): "ELEVATED",
    (61, 80): "HIGH",
    (81, 100): "CRITICAL",
}


def calculate_risk_score(findings: List[Dict]) -> Dict:
    """
    Calculate risk score based on findings.

    Args:
        findings: List of finding dicts with 'severity', 'confidence', 'category' keys

    Returns:
        Dict with total_score, risk_level, factors breakdown
    """
    factors = []
    total_score = 0

    # Group findings by category
    categories: Dict[str, List[Dict]] = {}
    for f in findings:
        cat = f.get("category", "other")
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(f)

    # Calculate score per category
    for category, cat_findings in categories.items():
        category_score = 0
        for f in cat_findings:
            severity = f.get("severity", "info")
            confidence = f.get("confidence", 50) / 100.0
            weight = SEVERITY_WEIGHTS.get(severity, 0)
            score = weight * confidence
            category_score += score

        # Cap category score contribution
        category_score = min(category_score, 40)
        total_score += category_score

        factors.append({
            "factor": f"{category.replace('_', ' ').title()} ({len(cat_findings)} findings)",
            "score": round(category_score),
            "weight": len(cat_findings),
        })

    # Cap total score at 100
    total_score = min(round(total_score), 100)

    # Determine risk level
    risk_level = "LOW"
    for (low, high), level in SEVERITY_THRESHOLDS.items():
        if low <= total_score <= high:
            risk_level = level
            break

    return {
        "total_score": total_score,
        "risk_level": risk_level,
        "factors": factors,
    }


def get_verdict(risk_score: int) -> str:
    """Map risk score to verdict string."""
    if risk_score <= 20:
        return "LOW_RISK"
    elif risk_score <= 40:
        return "MODERATE"
    elif risk_score <= 60:
        return "MODERATE"
    elif risk_score <= 80:
        return "HIGH_RISK"
    else:
        return "CRITICAL"
