'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import AppShell from '@/components/layout/AppShell';
import { demoScans } from '@/data/scans';
import { cn, formatDateTime, getRiskColor } from '@/lib/utils';
import { Plus, Globe, Upload, FileCode, ArrowRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';

function StatCard({ label, value, color, icon: Icon }: { label: string; value: number; color?: string; icon: React.ElementType }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = Math.max(1, value / 20);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-[#9ca3af] font-medium">{label}</span>
        <Icon className="w-4 h-4 text-[#9ca3af]" />
      </div>
      <p className={cn('text-[28px] font-light tracking-tight', color || 'text-[#111827] dark:text-white')}>{count}</p>
    </div>
  );
}

function ScanTypeIcon({ type }: { type: string }) {
  if (type === 'website') return <Globe className="w-3.5 h-3.5" />;
  if (type === 'file') return <Upload className="w-3.5 h-3.5" />;
  return <FileCode className="w-3.5 h-3.5" />;
}

function getVerdictBadge(verdict: string) {
  switch (verdict) {
    case 'SAFE':
    case 'LOW_RISK': return { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-400', label: verdict === 'SAFE' ? 'SAFE' : 'LOW RISK' };
    case 'MODERATE': return { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'MODERATE' };
    case 'SUSPICIOUS': return { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', label: 'SUSPICIOUS' };
    case 'HIGH_RISK': return { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', label: 'HIGH RISK' };
    case 'CRITICAL': return { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', label: 'CRITICAL' };
    default: return { bg: 'bg-gray-50 dark:bg-gray-950/30', text: 'text-gray-700 dark:text-gray-400', label: verdict };
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'COMPLETED': return { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-400' };
    case 'ANALYZING': case 'AI_REVIEW': return { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700 dark:text-blue-400' };
    case 'QUEUED': case 'VALIDATING': return { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-400' };
    case 'FAILED': return { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400' };
    default: return { bg: 'bg-gray-50 dark:bg-gray-950/30', text: 'text-gray-700 dark:text-gray-400' };
  }
}

export default function DashboardPage() {
  const { user } = useAuth();
  const completedScans = demoScans.filter((s) => s.status === 'COMPLETED');
  const safe = completedScans.filter((s) => s.verdict === 'SAFE' || s.verdict === 'LOW_RISK').length;
  const suspicious = completedScans.filter((s) => s.verdict === 'SUSPICIOUS').length;
  const highRisk = completedScans.filter((s) => s.verdict === 'HIGH_RISK').length;
  const critical = completedScans.filter((s) => s.verdict === 'CRITICAL').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppShell title="Dashboard">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">{greeting()}, {user?.name?.split(' ')[0]}</h2>
            <p className="text-[13px] text-[#9ca3af] mt-0.5">Here&apos;s your security overview.</p>
          </div>
          <Link href="/new-scan" className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a] text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            New Security Scan
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Total Scans" value={completedScans.length} icon={Globe} />
          <StatCard label="Safe" value={safe} color="text-green-600 dark:text-green-400" icon={Globe} />
          <StatCard label="Suspicious" value={suspicious} color="text-orange-600 dark:text-orange-400" icon={Globe} />
          <StatCard label="High Risk" value={highRisk} color="text-orange-600 dark:text-orange-400" icon={Globe} />
          <StatCard label="Critical" value={critical} color="text-red-600 dark:text-red-400" icon={Globe} />
        </div>

        {/* Recent Scans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white">Recent Scans</h3>
            <Link href="/scans" className="text-[12px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {demoScans.slice(0, 5).map((scan) => {
              const verdict = getVerdictBadge(scan.verdict);
              const statusBadge = getStatusBadge(scan.status);
              return (
                <Link
                  key={scan.id}
                  href={`/scans/${scan.id}`}
                  className="block p-4 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] hover:border-[#d1d5db] dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-[#f3f4f6] dark:bg-white/5 flex items-center justify-center text-[#6b7280] dark:text-[#a3a3a3]">
                        <ScanTypeIcon type={scan.type} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[#9ca3af]">{scan.scanId}</span>
                          <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', statusBadge.bg, statusBadge.text)}>
                            {scan.status}
                          </span>
                        </div>
                        <p className="text-[14px] font-medium text-[#111827] dark:text-white mt-0.5">{scan.target}</p>
                        <p className="text-[11px] text-[#9ca3af] mt-0.5 capitalize">{scan.type === 'source-code' ? 'Source Code' : scan.type} • {scan.completedAt ? formatDateTime(scan.completedAt) : 'In Progress'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {scan.status === 'COMPLETED' ? (
                        <>
                          <div className="flex items-center gap-2 justify-end">
                            <span className={cn('text-[20px] font-light', getRiskColor(scan.riskScore))}>{scan.riskScore}</span>
                            <span className="text-[10px] text-[#9ca3af]">/100</span>
                          </div>
                          <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block', verdict.bg, verdict.text)}>
                            {verdict.label}
                          </span>
                        </>
                      ) : (
                        <span className="text-[12px] text-[#9ca3af]">Running...</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Website Scan', desc: 'Analyze a URL for security threats', href: '/new-scan?type=website', icon: Globe, color: 'text-blue-500' },
            { title: 'Application Scan', desc: 'Upload and analyze a file', href: '/new-scan?type=file', icon: Upload, color: 'text-orange-500' },
            { title: 'Source Code Scan', desc: 'Scan a source code project', href: '/new-scan?type=source-code', icon: FileCode, color: 'text-purple-500' },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] hover:border-[#d1d5db] dark:hover:border-white/10 transition-colors group">
              <item.icon className={cn('w-5 h-5 mb-3', item.color)} />
              <h4 className="text-[14px] font-medium text-[#111827] dark:text-white">{item.title}</h4>
              <p className="text-[12px] text-[#9ca3af] mt-1">{item.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-[12px] text-[#6b7280] dark:text-[#a3a3a3] group-hover:text-[#111827] dark:group-hover:text-white transition-colors">
                Start Scan <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
