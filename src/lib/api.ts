/**
 * SENTINELX API Client
 * Wraps fetch with auth token handling and response mapping.
 */

const API_BASE = 'https://sentinelx-backend.onrender.com';

// --- Token management ---
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sentinelx_token');
}

export function setToken(token: string) {
  localStorage.setItem('sentinelx_token', token);
}

export function clearToken() {
  localStorage.removeItem('sentinelx_token');
}

// --- Snake/camel helpers ---
function toCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelizeKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(camelizeKeys);
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(
        ([k, v]) => [toCamel(k), camelizeKeys(v)]
      )
    );
  }
  return obj;
}

// --- Core fetch wrapper ---
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  // Only set Content-Type for JSON bodies (not FormData)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `API error ${res.status}`);
  }

  const data = await res.json();
  return camelizeKeys(data) as T;
}

// --- Auth API ---
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  me: () => apiFetch<{ id: number; email: string; name: string; role: string; createdAt: string; lastLogin: string | null }>('/api/auth/me'),
};

// --- Scans API ---
export interface ApiScan {
  id: number;
  scanId: string;
  type: string;
  target: string;
  status: string;
  riskScore: number;
  riskLevel: string;
  verdict: string;
  findingsCount: { critical: number; high: number; medium: number; low: number; info: number };
  submittedAt: string;
  completedAt: string | null;
  isDemo: boolean;
}

export interface ApiFinding {
  id: number;
  title: string;
  severity: string;
  confidence: number;
  description: string;
  evidence: string;
  location: string | null;
  affectedComponent: string | null;
  impact: string;
  recommendation: string;
  category: string;
  filePath: string | null;
  lineNumber: number | null;
  aiExplanation: string | null;
}

export interface ApiTimeline {
  stage: string;
  timestamp: string;
  status: string;
}

export interface ApiScanDetail {
  scan: ApiScan;
  findings: ApiFinding[];
  timeline: ApiTimeline[];
}

export const scansApi = {
  list: () => apiFetch<ApiScan[]>('/api/scans'),

  get: (id: number) => apiFetch<ApiScanDetail>(`/api/scans/${id}`),

  submitWebsite: (url: string) =>
    apiFetch<{ scanId: string; status: string; message: string }>('/api/scans/website', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),
};

// --- Dashboard API ---
export interface ApiDashboard {
  totalScans: number;
  safe: number;
  suspicious: number;
  highRisk: number;
  critical: number;
}

export const dashboardApi = {
  get: () => apiFetch<ApiDashboard>('/api/dashboard'),
};

// --- Notifications API ---
export interface ApiNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  scanId: string | null;
  createdAt: string;
}

export const notificationsApi = {
  list: () => apiFetch<ApiNotification[]>('/api/notifications'),

  markRead: (id: number) =>
    apiFetch<{ status: string }>(`/api/notifications/${id}/read`, { method: 'PATCH' }),

  markAllRead: () =>
    apiFetch<{ status: string }>('/api/notifications/read-all', { method: 'POST' }),
};

// --- Analyst API ---
export interface ApiAnalystCase {
  id: number;
  caseId: string;
  scanId: string;
  target: string;
  riskScore: number;
  severity: string;
  assignedAnalyst: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  notesCount: number;
}

export interface ApiAnalystCaseDetail {
  id: number;
  caseId: string;
  scanId: string;
  target: string;
  riskScore: number;
  severity: string;
  assignedAnalyst: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  notes: { id: number; author: string; content: string; timestamp: string }[];
}

export const analystApi = {
  listCases: () => apiFetch<ApiAnalystCase[]>('/api/analyst/cases'),

  getCase: (id: number) => apiFetch<ApiAnalystCaseDetail>(`/api/analyst/cases/${id}`),

  updateCase: (id: number, status: string) =>
    apiFetch<{ status: string; newStatus: string }>(`/api/analyst/cases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  addNote: (id: number, content: string) =>
    apiFetch<{ status: string; noteId: number }>(`/api/analyst/cases/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// --- Admin API ---
export const adminApi = {
  stats: () => apiFetch<Record<string, unknown>>('/api/admin/statistics'),
  users: () => apiFetch<unknown[]>('/api/admin/users'),
};
