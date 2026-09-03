'use client';

import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { cn } from '@/lib/utils';
import { Search, AlertTriangle, ArrowUpRight } from 'lucide-react';

const investigations = [
  { id: 'CASE-2026-0042', scanId: 'SCAN-2026-0902-00138', target: 'suspicious-login.example.net', risk: 72, severity: 'high', status: 'INVESTIGATING', analyst: 'Sarah Chen', created: '2026-09-02' },
  { id: 'CASE-2026-0041', scanId: 'SCAN-2026-0901-00131', target: 'suspicious-toolkit-v3.zip', risk: 89, severity: 'critical', status: 'ESCALATED', analyst: 'James Wright', created: '2026-09-01' },
  { id: 'CASE-2026-0040', scanId: 'SCAN-2026-0831-00124', target: 'webapp-project-main.zip', risk: 45, severity: 'medium', status: 'RESOLVED', analyst: 'Sarah Chen', created: '2026-08-31' },
  { id: 'CASE-2026-0039', scanId: 'SCAN-2026-0828-00112', target: 'update-patcher.exe', risk: 95, severity: 'critical', status: 'NEW', analyst: 'James Wright', created: '2026-08-28' },
];

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
  INVESTIGATING: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400',
  ESCALATED: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400',
  RESOLVED: 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400',
};

export default function InvestigationsPage() {
  return (
    <AppShell title="Investigations">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">Investigation Queue</h2>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">All active and recent security investigations.</p>
        </div>
        <div className="space-y-3">
          {investigations.map((inv) => (
            <Link key={inv.id} href="/analyst/dashboard" className="block p-4 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] hover:border-[#d1d5db] dark:hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#9ca3af]">{inv.id}</span>
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded', statusColors[inv.status])}>{inv.status}</span>
                  </div>
                  <p className="text-[14px] font-medium text-[#111827] dark:text-white mt-1">{inv.target}</p>
                  <p className="text-[11px] text-[#9ca3af] mt-0.5">Assigned to {inv.analyst} • {inv.created}</p>
                </div>
                <div className="text-right">
                  <span className={cn('text-[20px] font-light', inv.risk >= 80 ? 'text-red-500' : inv.risk >= 60 ? 'text-orange-500' : 'text-yellow-500')}>{inv.risk}</span>
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded', inv.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/30 text-red-600' : inv.severity === 'high' ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600' : 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600')}>
                      {inv.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
