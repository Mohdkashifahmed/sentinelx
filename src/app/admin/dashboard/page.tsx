'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { demoScans } from '@/data/scans';
import { demoAuditLogs } from '@/data/notifications';
import { cn, formatDateTime } from '@/lib/utils';
import { Users, Shield, Activity, AlertTriangle, TrendingUp, Eye, BarChart3, Settings } from 'lucide-react';

const demoUsers = [
  { id: '1', name: 'Alex Morgan', email: 'user@demo.com', role: 'user', lastLogin: new Date('2026-09-03T07:00:00'), scans: 7 },
  { id: '2', name: 'Jordan Lee', email: 'jordan@example.com', role: 'user', lastLogin: new Date('2026-09-02T14:30:00'), scans: 12 },
  { id: '3', name: 'Taylor Kim', email: 'taylor@example.com', role: 'user', lastLogin: new Date('2026-09-01T09:15:00'), scans: 5 },
  { id: '4', name: 'Casey Diaz', email: 'casey@example.com', role: 'user', lastLogin: new Date('2026-08-30T11:00:00'), scans: 3 },
];

const demoAnalysts = [
  { id: '5', name: 'Sarah Chen', email: 'analyst@demo.com', role: 'analyst', cases: 8, active: 3 },
  { id: '6', name: 'James Wright', email: 'james@demo.com', role: 'analyst', cases: 12, active: 5 },
  { id: '7', name: 'Priya Sharma', email: 'priya@demo.com', role: 'analyst', cases: 6, active: 2 },
];

const riskDistribution = [
  { label: 'Safe / Low', count: 2, color: 'bg-green-500' },
  { label: 'Moderate', count: 1, color: 'bg-yellow-500' },
  { label: 'Suspicious', count: 1, color: 'bg-orange-500' },
  { label: 'High', count: 1, color: 'bg-orange-500' },
  { label: 'Critical', count: 2, color: 'bg-red-500' },
];

const scanTypeDistribution = [
  { label: 'Website', count: 4, color: 'bg-blue-500' },
  { label: 'File', count: 2, color: 'bg-orange-500' },
  { label: 'Source Code', count: 1, color: 'bg-purple-500' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analysts' | 'audit'>('overview');

  return (
    <AppShell title="Admin Dashboard">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">Admin Dashboard</h2>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">Platform management and system overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Users', value: '4', icon: Users, color: 'text-blue-500' },
            { label: 'Total Analysts', value: '3', icon: Shield, color: 'text-purple-500' },
            { label: 'Total Scans', value: demoScans.length.toString(), icon: Activity, color: 'text-green-500' },
            { label: 'Scans Today', value: '2', icon: TrendingUp, color: 'text-blue-500' },
            { label: 'Critical Threats', value: '2', icon: AlertTriangle, color: 'text-red-500' },
            { label: 'System Health', value: 'OK', icon: Eye, color: 'text-green-500' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <s.icon className={cn('w-4 h-4 mb-2', s.color)} />
              <p className="text-[22px] font-light text-[#111827] dark:text-white">{s.value}</p>
              <p className="text-[10px] text-[#9ca3af]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#e5e7eb] dark:border-white/5">
          {(['overview', 'users', 'analysts', 'audit'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={cn('px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px capitalize', activeTab === tab ? 'border-[#111827] dark:border-white text-[#111827] dark:text-white' : 'border-transparent text-[#6b7280] hover:text-[#111827]')}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Risk Distribution */}
            <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Risk Distribution</h3>
              <div className="space-y-3">
                {riskDistribution.map((r) => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-[#6b7280] dark:text-[#a3a3a3]">{r.label}</span>
                      <span className="text-[#111827] dark:text-white font-medium">{r.count}</span>
                    </div>
                    <div className="h-2 bg-[#f3f4f6] dark:bg-white/5 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', r.color)} style={{ width: `${(r.count / demoScans.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scan Type Distribution */}
            <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Scan Type Distribution</h3>
              <div className="space-y-3">
                {scanTypeDistribution.map((r) => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between text-[12px] mb-1">
                      <span className="text-[#6b7280] dark:text-[#a3a3a3]">{r.label}</span>
                      <span className="text-[#111827] dark:text-white font-medium">{r.count}</span>
                    </div>
                    <div className="h-2 bg-[#f3f4f6] dark:bg-white/5 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', r.color)} style={{ width: `${(r.count / demoScans.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] md:col-span-2">
              <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-2">
                {demoAuditLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-2 h-2 rounded-full', log.result === 'success' ? 'bg-green-500' : 'bg-red-500')} />
                      <div>
                        <p className="text-[12px] text-[#111827] dark:text-white font-medium">{log.action}</p>
                        <p className="text-[11px] text-[#9ca3af]">by {log.user} • {log.target}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#9ca3af]">{formatDateTime(log.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] animate-fade-in">
            <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">User Management</h3>
            <div className="space-y-2">
              {demoUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02] border border-[#f3f4f6] dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#111827] dark:bg-white/10 flex items-center justify-center">
                      <span className="text-[10px] font-medium text-white">{u.name.split(' ').map((n) => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#111827] dark:text-white">{u.name}</p>
                      <p className="text-[11px] text-[#9ca3af]">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] text-[#9ca3af]">{u.scans} scans</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-medium capitalize">{u.role}</span>
                    <button className="text-[11px] text-[#6b7280] hover:text-[#111827]">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analysts' && (
          <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] animate-fade-in">
            <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Analyst Management</h3>
            <div className="space-y-2">
              {demoAnalysts.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02] border border-[#f3f4f6] dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <span className="text-[10px] font-medium text-white">{a.name.split(' ').map((n) => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#111827] dark:text-white">{a.name}</p>
                      <p className="text-[11px] text-[#9ca3af]">{a.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[12px] text-[#111827] dark:text-white">{a.cases} total cases</p>
                      <p className="text-[11px] text-[#9ca3af]">{a.active} active</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-medium">ANALYST</span>
                    <button className="text-[11px] text-[#6b7280] hover:text-[#111827]">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] animate-fade-in">
            <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Audit Logs</h3>
            <div className="space-y-1">
              {demoAuditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2.5 px-3 rounded hover:bg-[#f8f9fa] dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-2 h-2 rounded-full flex-shrink-0', log.result === 'success' ? 'bg-green-500' : log.result === 'failed' ? 'bg-red-500' : 'bg-yellow-500')} />
                    <div>
                      <p className="text-[12px] text-[#111827] dark:text-white">{log.action}</p>
                      <p className="text-[10px] text-[#9ca3af]">{log.user} → {log.target}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', log.result === 'success' ? 'bg-green-50 dark:bg-green-950/30 text-green-600' : 'bg-red-50 dark:bg-red-950/30 text-red-600')}>
                      {log.result.toUpperCase()}
                    </span>
                    <p className="text-[10px] text-[#9ca3af] mt-0.5">{formatDateTime(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
