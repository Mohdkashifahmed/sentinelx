'use client';

import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { demoScans, demoReports } from '@/data/scans';
import { cn, formatDateTime, getRiskColor } from '@/lib/utils';
import { FileText, Download, ArrowRight, Globe, Upload, FileCode } from 'lucide-react';

export default function ReportsPage() {
  const completedScans = demoScans.filter((s) => s.status === 'COMPLETED');

  return (
    <AppShell title="Reports">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">Security Reports</h2>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">Professional security analysis reports for all completed scans.</p>
        </div>

        <div className="space-y-4">
          {completedScans.map((scan) => {
            const report = demoReports[scan.id];
            return (
              <div key={scan.id} className="rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] dark:bg-white/5 flex items-center justify-center text-[#6b7280]">
                        {scan.type === 'website' ? <Globe className="w-5 h-5" /> : scan.type === 'file' ? <Upload className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-[11px] font-mono text-[#9ca3af]">{scan.scanId}</p>
                        <h3 className="text-[15px] font-medium text-[#111827] dark:text-white mt-0.5">{scan.target}</h3>
                        <p className="text-[12px] text-[#9ca3af] mt-0.5">{report?.title || `Security Analysis — ${scan.target}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={cn('text-[24px] font-light', getRiskColor(scan.riskScore))}>{scan.riskScore}</span>
                        <span className="text-[10px] text-[#9ca3af]">/100</span>
                      </div>
                    </div>
                  </div>

                  {report && (
                    <div className="mt-4 p-4 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02] border border-[#f3f4f6] dark:border-white/5">
                      <p className="text-[12px] font-medium text-[#111827] dark:text-white mb-2">Executive Summary</p>
                      <p className="text-[12px] text-[#6b7280] dark:text-[#a3a3a3] line-clamp-3 leading-relaxed">{report.executiveSummary}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-[11px] text-[#9ca3af]">Generated {report ? formatDateTime(report.generatedAt) : formatDateTime(scan.completedAt!)}</p>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e5e7eb] dark:border-white/10 text-[12px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white transition-colors">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                      <Link href={`/scans/${scan.id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a] text-[12px] font-medium hover:opacity-90 transition-opacity">
                        View Report <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
