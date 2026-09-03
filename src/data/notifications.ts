import { Notification } from './types';

export const demoNotifications: Notification[] = [
  { id: 'n1', type: 'scan_complete', title: 'Scan Completed', message: 'Your scan of example-safe.com has completed. Risk Score: 12 (Low Risk).', read: false, createdAt: new Date('2026-09-03T08:17:42'), scanId: '1' },
  { id: 'n2', type: 'high_risk', title: 'Critical Threat Detected', message: 'Scan SCAN-2026-0901-00131 detected critical malware indicators in suspicious-toolkit-v3.zip. Immediate action required.', read: false, createdAt: new Date('2026-09-01T11:12:33'), scanId: '3' },
  { id: 'n3', type: 'report_ready', title: 'Report Generated', message: 'Your security report for suspicious-login.example.net is now available for download.', read: true, createdAt: new Date('2026-09-02T14:26:18'), scanId: '2' },
  { id: 'n4', type: 'analyst_review', title: 'Analyst Review Complete', message: 'An analyst has reviewed scan SCAN-2026-0831-00124 and confirmed findings.', read: true, createdAt: new Date('2026-08-31T14:00:00'), scanId: '4' },
  { id: 'n5', type: 'scan_complete', title: 'Scan Completed', message: 'Your scan of webapp-project-main.zip has completed. Risk Score: 45 (Elevated).', read: true, createdAt: new Date('2026-08-31T09:35:17'), scanId: '4' },
  { id: 'n6', type: 'high_risk', title: 'Suspicious Activity Detected', message: 'Scan of update-patcher.exe detected 5 critical findings. Classification: CRITICAL.', read: false, createdAt: new Date('2026-08-28T10:18:45'), scanId: '6' },
  { id: 'n7', type: 'system', title: 'System Maintenance', message: 'Scheduled maintenance window: September 5, 2026, 02:00-04:00 UTC.', read: true, createdAt: new Date('2026-09-02T09:00:00') },
  { id: 'n8', type: 'case_escalated', title: 'Case Escalated', message: 'Case CASE-2026-0042 has been escalated to senior analyst review.', read: false, createdAt: new Date('2026-09-02T16:30:00') },
];

export const demoAuditLogs = [
  { id: 'al1', timestamp: new Date('2026-09-03T08:15:00'), user: 'Alex Morgan', action: 'Scan Submitted', target: 'SCAN-2026-0903-00142', result: 'success' as const, ip: '192.168.1.45' },
  { id: 'al2', timestamp: new Date('2026-09-03T08:17:42'), user: 'System', action: 'Scan Completed', target: 'SCAN-2026-0903-00142', result: 'success' as const },
  { id: 'al3', timestamp: new Date('2026-09-02T14:22:00'), user: 'Alex Morgan', action: 'Scan Submitted', target: 'SCAN-2026-0902-00138', result: 'success' as const, ip: '192.168.1.45' },
  { id: 'al4', timestamp: new Date('2026-09-02T14:26:18'), user: 'System', action: 'Report Generated', target: 'SCAN-2026-0902-00138', result: 'success' as const },
  { id: 'al5', timestamp: new Date('2026-09-02T16:30:00'), user: 'Sarah Chen', action: 'Case Escalated', target: 'CASE-2026-0042', result: 'success' as const, ip: '10.0.0.22' },
  { id: 'al6', timestamp: new Date('2026-09-01T11:05:00'), user: 'Alex Morgan', action: 'File Uploaded', target: 'suspicious-toolkit-v3.zip', result: 'success' as const, ip: '192.168.1.45' },
  { id: 'al7', timestamp: new Date('2026-09-01T11:12:33'), user: 'System', action: 'Scan Completed', target: 'SCAN-2026-0901-00131', result: 'success' as const },
  { id: 'al8', timestamp: new Date('2026-08-31T09:35:17'), user: 'System', action: 'Scan Completed', target: 'SCAN-2026-0831-00124', result: 'success' as const },
  { id: 'al9', timestamp: new Date('2026-08-31T14:00:00'), user: 'James Wright', action: 'Verdict Confirmed', target: 'SCAN-2026-0831-00124', result: 'success' as const, ip: '10.0.0.31' },
  { id: 'al10', timestamp: new Date('2026-08-30T16:45:00'), user: 'Alex Morgan', action: 'Scan Submitted', target: 'SCAN-2026-0830-00119', result: 'success' as const, ip: '192.168.1.45' },
  { id: 'al11', timestamp: new Date('2026-08-28T10:12:00'), user: 'Alex Morgan', action: 'File Uploaded', target: 'update-patcher.exe', result: 'success' as const, ip: '192.168.1.45' },
  { id: 'al12', timestamp: new Date('2026-08-28T10:18:45'), user: 'System', action: 'Critical Threat Detected', target: 'SCAN-2026-0828-00112', result: 'success' as const },
  { id: 'al13', timestamp: new Date('2026-09-03T07:00:00'), user: 'Alex Morgan', action: 'Login', target: 'User Session', result: 'success' as const, ip: '192.168.1.45' },
  { id: 'al14', timestamp: new Date('2026-09-02T08:30:00'), user: 'Sarah Chen', action: 'Login', target: 'Analyst Session', result: 'success' as const, ip: '10.0.0.22' },
  { id: 'al15', timestamp: new Date('2026-09-02T22:15:00'), user: 'Unknown', action: 'Login Attempt', target: 'admin@sentinelx.io', result: 'failed' as const, ip: '203.45.67.89' },
];
