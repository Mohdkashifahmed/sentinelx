'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { cn, formatDateTime, getSeverityColor } from '@/lib/utils';
import { Search, AlertTriangle, Clock, Eye, ChevronRight, MessageSquare, Plus, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { AnalystCase, CaseStatus } from '@/data/types';

const demoCases: AnalystCase[] = [
  { id: '1', caseId: 'CASE-2026-0042', scanId: 'SCAN-2026-0902-00138', target: 'suspicious-login.example.net', riskScore: 72, severity: 'high', assignedAnalyst: 'Sarah Chen', status: 'INVESTIGATING', createdAt: new Date('2026-09-02T15:00:00'), updatedAt: new Date('2026-09-03T09:15:00'), notes: [
    { id: 'n1', author: 'Sarah Chen', content: 'Initial analysis confirms phishing indicators. Credential harvesting form verified.', timestamp: new Date('2026-09-02T16:00:00') },
    { id: 'n2', author: 'Sarah Chen', content: 'Cross-referencing with known phishing kits. Matches pattern from Q3 campaign.', timestamp: new Date('2026-09-03T09:15:00') },
  ]},
  { id: '2', caseId: 'CASE-2026-0041', scanId: 'SCAN-2026-0901-00131', target: 'suspicious-toolkit-v3.zip', riskScore: 89, severity: 'critical', assignedAnalyst: 'James Wright', status: 'ESCALATED', createdAt: new Date('2026-09-01T11:30:00'), updatedAt: new Date('2026-09-02T10:00:00'), notes: [
    { id: 'n3', author: 'James Wright', content: 'Malware confirmed. RAT + credential stealer + persistence mechanism. Full analysis report submitted.', timestamp: new Date('2026-09-01T14:00:00') },
    { id: 'n4', author: 'Marcus Webb', content: 'Escalated to incident response team. C2 IPs added to blocklist.', timestamp: new Date('2026-09-02T10:00:00') },
  ]},
  { id: '3', caseId: 'CASE-2026-0040', scanId: 'SCAN-2026-0831-00124', target: 'webapp-project-main.zip', riskScore: 45, severity: 'medium', assignedAnalyst: 'Sarah Chen', status: 'RESOLVED', createdAt: new Date('2026-08-31T10:00:00'), updatedAt: new Date('2026-09-01T08:00:00'), notes: [
    { id: 'n5', author: 'Sarah Chen', content: 'Code-level findings verified. SQL injection and command injection confirmed. Developer notified.', timestamp: new Date('2026-08-31T14:00:00') },
  ]},
  { id: '4', caseId: 'CASE-2026-0039', scanId: 'SCAN-2026-0828-00112', target: 'update-patcher.exe', riskScore: 95, severity: 'critical', assignedAnalyst: 'James Wright', status: 'NEW', createdAt: new Date('2026-08-28T11:00:00'), updatedAt: new Date('2026-08-28T11:00:00'), notes: [] },
  { id: '5', caseId: 'CASE-2026-0038', scanId: 'SCAN-2026-0825-00105', target: 'phishing-kit-v2.tar.gz', riskScore: 62, severity: 'high', assignedAnalyst: 'Sarah Chen', status: 'FALSE_POSITIVE', createdAt: new Date('2026-08-25T09:00:00'), updatedAt: new Date('2026-08-26T14:00:00'), notes: [
    { id: 'n6', author: 'Sarah Chen', content: 'After manual review, the suspicious indicators were determined to be false positives from a legitimate security testing toolkit.', timestamp: new Date('2026-08-26T14:00:00') },
  ]},
];

const statusColors: Record<CaseStatus, { bg: string; text: string }> = {
  NEW: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400' },
  INVESTIGATING: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-600 dark:text-yellow-400' },
  ESCALATED: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400' },
  RESOLVED: { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-600 dark:text-green-400' },
  FALSE_POSITIVE: { bg: 'bg-gray-50 dark:bg-gray-950/30', text: 'text-gray-600 dark:text-gray-400' },
};

export default function AnalystDashboardPage() {
  const [cases, setCases] = useState(demoCases);
  const [selectedCase, setSelectedCase] = useState<AnalystCase | null>(null);
  const [newNote, setNewNote] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all' ? cases : cases.filter((c) => c.status === statusFilter);
  const stats = {
    active: cases.filter((c) => c.status === 'NEW' || c.status === 'INVESTIGATING').length,
    escalated: cases.filter((c) => c.status === 'ESCALATED').length,
    critical: cases.filter((c) => c.severity === 'critical' && c.status !== 'RESOLVED' && c.status !== 'FALSE_POSITIVE').length,
    resolved: cases.filter((c) => c.status === 'RESOLVED').length,
  };

  const addNote = () => {
    if (!newNote.trim() || !selectedCase) return;
    const note = { id: Date.now().toString(), author: 'Sarah Chen', content: newNote, timestamp: new Date() };
    setCases((prev) => prev.map((c) => c.id === selectedCase.id ? { ...c, notes: [...c.notes, note], updatedAt: new Date() } : c));
    setSelectedCase((prev) => prev ? { ...prev, notes: [...prev.notes, note] } : null);
    setNewNote('');
  };

  const updateStatus = (caseId: string, status: CaseStatus) => {
    setCases((prev) => prev.map((c) => c.id === caseId ? { ...c, status, updatedAt: new Date() } : c));
    setSelectedCase((prev) => prev?.id === caseId ? { ...prev, status } : prev);
  };

  return (
    <AppShell title="Analyst Dashboard">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">Analyst Dashboard</h2>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">Investigation queue and case management.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Active Cases', value: stats.active, color: 'text-blue-500' },
            { label: 'Escalated', value: stats.escalated, color: 'text-red-500' },
            { label: 'Critical Open', value: stats.critical, color: 'text-red-500' },
            { label: 'Resolved', value: stats.resolved, color: 'text-green-500' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <p className={cn('text-[28px] font-light', s.color)}>{s.value}</p>
              <p className="text-[11px] text-[#9ca3af]">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case List */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white">Investigation Queue</h3>
            </div>
            <div className="flex gap-2 mb-3">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none px-3 py-1.5 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-[12px] text-[#6b7280] focus:outline-none">
                <option value="all">All Status</option>
                <option value="NEW">New</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="ESCALATED">Escalated</option>
                <option value="RESOLVED">Resolved</option>
                <option value="FALSE_POSITIVE">False Positive</option>
              </select>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filtered.map((c) => {
                const st = statusColors[c.status];
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={cn('w-full text-left p-4 rounded-xl border transition-all', selectedCase?.id === c.id ? 'border-[#111827] dark:border-white/20 bg-[#f8f9fa] dark:bg-white/[0.03]' : 'border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] hover:border-[#d1d5db]')}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-[#9ca3af]">{c.caseId}</span>
                      <span className={cn('text-[9px] font-medium px-1.5 py-0.5 rounded', st.bg, st.text)}>{c.status}</span>
                    </div>
                    <p className="text-[13px] font-medium text-[#111827] dark:text-white truncate">{c.target}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={cn('text-[12px] font-medium', c.riskScore >= 80 ? 'text-red-500' : c.riskScore >= 60 ? 'text-orange-500' : 'text-yellow-500')}>
                        Risk: {c.riskScore}
                      </span>
                      <span className="text-[10px] text-[#9ca3af]">{c.notes.length} notes</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Case Detail */}
          <div className="lg:col-span-2">
            {selectedCase ? (
              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#9ca3af]">{selectedCase.caseId}</span>
                      <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white mt-1">{selectedCase.target}</h3>
                      <p className="text-[12px] text-[#9ca3af] mt-0.5">Scan: {selectedCase.scanId} • Risk Score: {selectedCase.riskScore}</p>
                    </div>
                    <div className="flex gap-2">
                      {(['NEW', 'INVESTIGATING', 'ESCALATED', 'RESOLVED', 'FALSE_POSITIVE'] as CaseStatus[]).map((s) => (
                        <button key={s} onClick={() => updateStatus(selectedCase.id, s)} className={cn('text-[10px] font-medium px-2 py-1 rounded', selectedCase.status === s ? statusColors[s].bg + ' ' + statusColors[s].text : 'text-[#9ca3af] hover:bg-[#f3f4f6] dark:hover:bg-white/5')}>
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                  <h4 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-4">Investigation Notes</h4>
                  <div className="space-y-3 mb-4">
                    {selectedCase.notes.length === 0 ? (
                      <p className="text-[12px] text-[#9ca3af] text-center py-4">No notes yet. Add your first investigation note below.</p>
                    ) : (
                      selectedCase.notes.map((note) => (
                        <div key={note.id} className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02] border border-[#f3f4f6] dark:border-white/5">
                          <div className="flex items-center gap-2 mb-1.5">
                            <MessageSquare className="w-3 h-3 text-[#9ca3af]" />
                            <span className="text-[11px] font-medium text-[#111827] dark:text-white">{note.author}</span>
                            <span className="text-[10px] text-[#9ca3af]">{formatDateTime(note.timestamp)}</span>
                          </div>
                          <p className="text-[12px] text-[#6b7280] dark:text-[#a3a3a3]">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newNote} onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addNote()}
                      placeholder="Add investigation note..."
                      className="flex-1 px-3 py-2 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-[#f8f9fa] dark:bg-white/5 text-[12px] text-[#111827] dark:text-white placeholder:text-[#9ca3af] focus:outline-none"
                    />
                    <button onClick={addNote} disabled={!newNote.trim()} className="px-4 py-2 rounded-lg bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a] text-[12px] font-medium hover:opacity-90 disabled:opacity-50">
                      Add
                    </button>
                  </div>
                </div>

                <a href={`/scans/${selectedCase.id}`} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#e5e7eb] dark:border-white/5 text-[13px] font-medium text-[#6b7280] hover:text-[#111827] dark:hover:text-white hover:bg-[#f8f9fa] dark:hover:bg-white/[0.02] transition-colors">
                  View Full Scan Report <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] dark:border-white/10">
                <p className="text-[13px] text-[#9ca3af]">Select a case to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
