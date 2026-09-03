// Types and interfaces for SENTINELX Cybersecurity Analysis Platform

// === ENUMS ===
export type UserRole = 'user' | 'analyst' | 'admin';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type RiskLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
export type ScanType = 'website' | 'file' | 'source-code';
export type ScanStatus = 'QUEUED' | 'VALIDATING' | 'ANALYZING' | 'AI_REVIEW' | 'REPORT_GENERATION' | 'COMPLETED' | 'FAILED';
export type Verdict = 'SAFE' | 'LOW_RISK' | 'MODERATE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL';
export type CaseStatus = 'NEW' | 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED' | 'FALSE_POSITIVE';
export type NotificationType = 'scan_complete' | 'high_risk' | 'report_ready' | 'analyst_review' | 'case_escalated' | 'system';

// === USER & AUTH ===
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// === SCANS ===
export interface Scan {
  id: string;
  scanId: string; // e.g. SCAN-2026-0903-00142
  userId: string;
  type: ScanType;
  target: string;
  status: ScanStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  verdict: Verdict;
  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  submittedAt: Date;
  completedAt?: Date;
  isDemo?: boolean;
}

export interface ScanTimeline {
  stage: string;
  timestamp: Date;
  status: 'completed' | 'current' | 'pending';
}

// === FINDINGS ===
export interface Finding {
  id: string;
  scanId: string;
  title: string;
  severity: Severity;
  confidence: number; // 0-100
  description: string;
  evidence: string;
  location?: string;
  affectedComponent?: string;
  impact: string;
  recommendation: string;
  aiExplanation?: string;
  isFalsePositive?: boolean;
  category: string;
  file?: string;
  line?: number;
}

// === RISK ENGINE ===
export interface RiskFactor {
  factor: string;
  score: number;
  weight: number;
}

export interface RiskBreakdown {
  factors: RiskFactor[];
  totalScore: number;
  riskLevel: RiskLevel;
}

// === AI ANALYSIS ===
export interface AIAnalysis {
  id: string;
  scanId: string;
  threatExplanation: string;
  riskSummary: string;
  remediationSteps: string[];
  codeReview?: string;
  falsePositiveAssessment?: string;
  finalRecommendation: string;
  generatedAt: Date;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

// === REPORTS ===
export interface SecurityReport {
  id: string;
  scanId: string;
  title: string;
  executiveSummary: string;
  overallScore: number;
  riskLevel: RiskLevel;
  verdict: Verdict;
  findings: Finding[];
  aiAnalysis: AIAnalysis;
  remediationPlan: RemediationStep[];
  finalRecommendation: string;
  generatedAt: Date;
}

export interface RemediationStep {
  priority: 1 | 2 | 3;
  title: string;
  severity: Severity;
  description: string;
  findingId?: string;
}

// === ANALYST ===
export interface AnalystCase {
  id: string;
  caseId: string;
  scanId: string;
  target: string;
  riskScore: number;
  severity: Severity;
  assignedAnalyst: string;
  status: CaseStatus;
  createdAt: Date;
  updatedAt: Date;
  notes: AnalystNote[];
}

export interface AnalystNote {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
}

// === NOTIFICATIONS ===
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  scanId?: string;
}

// === AUDIT LOGS ===
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  target: string;
  result: 'success' | 'failed' | 'pending';
  ip?: string;
  details?: string;
}

// === ADMIN ===
export interface SystemStats {
  totalUsers: number;
  totalAnalysts: number;
  totalScans: number;
  scansToday: number;
  criticalThreats: number;
  systemHealth: 'operational' | 'degraded' | 'down';
}

// === THREAT INTELLIGENCE ===
export interface ThreatLocation {
  country: string;
  code: string;
  scans: number;
  suspicious: number;
  highRisk: number;
  critical: number;
  lat: number;
  lng: number;
}

// === SETTINGS ===
export interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar?: string;
  };
  notifications: {
    email: boolean;
    scanComplete: boolean;
    highRisk: boolean;
    reportReady: boolean;
    analystReview: boolean;
  };
  security: {
    twoFactor: boolean;
    lastPasswordChange: Date;
  };
}

// === SECURITY POSTURE ===
export interface SecurityPosture {
  overallScore: number;
  openCritical: number;
  openHigh: number;
  resolvedIssues: number;
  recentImprovements: number;
  trend: 'improving' | 'stable' | 'declining';
}

// === RECENT SCAN (for comparison) ===
export interface ScanComparison {
  previousScan: Scan;
  latestScan: Scan;
  resolvedIssues: Finding[];
  newIssues: Finding[];
  scoreImprovement: number;
}
