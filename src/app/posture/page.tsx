'use client';

import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { demoScans, demoComparison } from '@/data/scans';
import { cn, getRiskColor } from '@/lib/utils';
import { Shield, TrendingUp, TrendingDown, Minus, CheckCircle2, AlertTriangle, ArrowRight, BarChart3 } from 'lucide-react';

export default function PosturePage() {
  const completed = demoScans.filter((s) => s.status === 'COMPLETED');
  const avgScore = completed.length > 0 ? Math.round(completed.reduce((a, s) => a + s.riskScore, 0) / completed.length) : 0;
  const criticalOpen = completed.filter((s) => s.verdict === 'CRITICAL').length;
  const highOpen = completed.filter((s) => s.verdict === 'HIGH_RISK' || s.verdict === 'SUSPICIOUS').length;
  const resolved = completed.filter((s) => s.verdict === 'SAFE' || s.verdict === 'LOW_RISK').length;
  const improvements = demoComparison.scoreImprovement;

  const getScoreColor = (score: number) => {
    if (score <= 20) return 'text-green-500';
    if (score <= 40) return 'text-yellow-500';
    if (score <= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <AppShell title="Security Posture">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">Security Posture</h2>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">Your overall security health across all scanned assets.</p>
        </div>

        {/* Overall Score */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] text-center">
            <Shield className={cn('w-8 h-8 mx-auto mb-3', getScoreColor(avgScore))} />
            <p className={cn('text-[48px] font-light', getScoreColor(avgScore))}>{avgScore}</p>
            <p className="text-[12px] text-[#9ca3af]">Overall Score</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-[11px] text-green-500 font-medium">+{improvements} improvement</span>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-950/10">
            <AlertTriangle className="w-5 h-5 text-red-500 mb-2" />
            <p className="text-[28px] font-light text-red-500">{criticalOpen}</p>
            <p className="text-[12px] text-[#9ca3af]">Open Critical Issues</p>
          </div>
          <div className="p-5 rounded-xl border border-orange-200 dark:border-orange-800/30 bg-orange-50 dark:bg-orange-950/10">
            <AlertTriangle className="w-5 h-5 text-orange-500 mb-2" />
            <p className="text-[28px] font-light text-orange-500">{highOpen}</p>
            <p className="text-[12px] text-[#9ca3af]">Open High Issues</p>
          </div>
          <div className="p-5 rounded-xl border border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-950/10">
            <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-[28px] font-light text-green-500">{resolved}</p>
            <p className="text-[12px] text-[#9ca3af]">Resolved Issues</p>
          </div>
        </div>

        {/* Score Trend */}
        <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
          <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Score Trend</h3>
          <div className="flex items-end gap-2 h-[120px]">
            {[78, 72, 68, 55, 45, 38, 28, avgScore].map((score, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[#9ca3af]">{score}</span>
                <div className={cn('w-full rounded-t transition-all', getScoreColor(score).replace('text-', 'bg-'))} style={{ height: `${score}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-[#9ca3af]">
            <span>8 weeks ago</span>
            <span>Now</span>
          </div>
        </div>

        {/* Comparison */}
        <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
          <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Recent Improvement — {demoComparison.latestScan.target}</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02]">
              <p className="text-[11px] text-[#9ca3af] mb-1">Previous Scan</p>
              <p className={cn('text-[32px] font-light', getRiskColor(demoComparison.previousScan.riskScore))}>{demoComparison.previousScan.riskScore}</p>
              <p className="text-[12px] text-[#9ca3af]">{demoComparison.previousScan.scanId}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/10 border border-green-200 dark:border-green-800/30">
              <p className="text-[11px] text-green-600 dark:text-green-400 mb-1">Latest Scan</p>
              <p className={cn('text-[32px] font-light', getRiskColor(demoComparison.latestScan.riskScore))}>{demoComparison.latestScan.riskScore}</p>
              <p className="text-[12px] text-green-600 dark:text-green-400 font-medium">Security posture improved</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[12px] font-medium text-green-600 dark:text-green-400 mb-2">Resolved Issues ({demoComparison.resolvedIssues.length})</p>
              {demoComparison.resolvedIssues.map((f) => (
                <div key={f.id} className="flex items-start gap-2 py-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5" />
                  <span className="text-[12px] text-[#6b7280] dark:text-[#a3a3a3]">{f.title}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[12px] font-medium text-orange-600 dark:text-orange-400 mb-2">New Issues ({demoComparison.newIssues.length})</p>
              {demoComparison.newIssues.map((f) => (
                <div key={f.id} className="flex items-start gap-2 py-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500 mt-0.5" />
                  <span className="text-[12px] text-[#6b7280] dark:text-[#a3a3a3]">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Asset Overview */}
        <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
          <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Asset Overview</h3>
          <div className="space-y-3">
            {completed.map((scan) => (
              <Link key={scan.id} href={`/scans/${scan.id}`} className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02] border border-[#f3f4f6] dark:border-white/5 hover:border-[#d1d5db] dark:hover:border-white/10 transition-colors">
                <div>
                  <p className="text-[13px] font-medium text-[#111827] dark:text-white">{scan.target}</p>
                  <p className="text-[11px] text-[#9ca3af] capitalize">{scan.type} • {scan.scanId}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-[18px] font-light', getRiskColor(scan.riskScore))}>{scan.riskScore}</span>
                  <ArrowRight className="w-4 h-4 text-[#9ca3af]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
