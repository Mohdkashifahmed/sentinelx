'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { scansApi, ApiScan } from '@/lib/api';
import { cn, formatDateTime, getRiskColor } from '@/lib/utils';
import { Globe, Upload, FileCode, Search, Filter, ArrowUpDown } from 'lucide-react';

export default function ScansPage() {
  const [scans, setScans] = useState<ApiScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [verdictFilter, setVerdictFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    scansApi.list()
      .then(setScans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  let filtered = [...scans];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((s) => s.scanId.toLowerCase().includes(q) || s.target.toLowerCase().includes(q));
  }
  if (typeFilter !== 'all') filtered = filtered.filter((s) => s.type === typeFilter);
  if (verdictFilter !== 'all') {
    filtered = filtered.filter((s) => {
      if (verdictFilter === 'safe') return s.verdict === 'SAFE' || s.verdict === 'LOW_RISK';
      if (verdictFilter === 'suspicious') return s.verdict === 'SUSPICIOUS';
      if (verdictFilter === 'high') return s.verdict === 'HIGH_RISK';
      if (verdictFilter === 'critical') return s.verdict === 'CRITICAL';
      return s.verdict === 'MODERATE';
    });
  }
  filtered.sort((a, b) => {
    const dateA = new Date(a.submittedAt).getTime();
    const dateB = new Date(b.submittedAt).getTime();
    if (sortBy === 'newest') return dateB - dateA;
    if (sortBy === 'oldest') return dateA - dateB;
    if (sortBy === 'highest') return b.riskScore - a.riskScore;
    return a.riskScore - b.riskScore;
  });

  const getScanIcon = (type: string) => {
    if (type === 'website') return <Globe className="w-4 h-4" />;
    if (type === 'file') return <Upload className="w-4 h-4" />;
    return <FileCode className="w-4 h-4" />;
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'SAFE': case 'LOW_RISK': return { bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-400', label: verdict === 'SAFE' ? 'SAFE' : 'LOW RISK' };
      case 'MODERATE': return { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'MODERATE' };
      case 'SUSPICIOUS': return { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', label: 'SUSPICIOUS' };
      case 'HIGH_RISK': return { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-400', label: 'HIGH RISK' };
      case 'CRITICAL': return { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700 dark:text-red-400', label: 'CRITICAL' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', label: verdict };
    }
  };

  if (loading) {
    return (
      <AppShell title="Scan History">
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-[#111827] dark:border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Scan History">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">Scan History</h2>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">Browse and filter all your security scans.</p>
        </div>

        {/* Search + Filters */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by scan ID or target..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-[13px] text-[#111827] dark:text-white placeholder:text-[#9ca3af] focus:outline-none focus:border-[#d1d5db] dark:focus:border-white/20"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg border text-[13px] font-medium transition-colors', showFilters ? 'border-[#111827] dark:border-white/20 bg-[#111827] dark:bg-white/10 text-white' : 'border-[#e5e7eb] dark:border-white/10 text-[#6b7280] dark:text-[#a3a3a3] hover:border-[#d1d5db]')}>
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="relative">
              <select
                value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none px-4 py-2.5 pr-8 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-[13px] text-[#6b7280] dark:text-[#a3a3a3] focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Risk</option>
                <option value="lowest">Lowest Risk</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9ca3af] pointer-events-none" />
            </div>
          </div>

          {showFilters && (
            <div className="flex gap-3 animate-fade-in">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-[12px] text-[#6b7280] focus:outline-none">
                <option value="all">All Types</option>
                <option value="website">Website</option>
                <option value="file">Application</option>
                <option value="source-code">Source Code</option>
              </select>
              <select value={verdictFilter} onChange={(e) => setVerdictFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#0a0a0a] text-[12px] text-[#6b7280] focus:outline-none">
                <option value="all">All Verdicts</option>
                <option value="safe">Safe / Low Risk</option>
                <option value="moderate">Moderate</option>
                <option value="suspicious">Suspicious</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-3">
          {filtered.map((scan) => {
            const verdict = getVerdictBadge(scan.verdict);
            return (
              <Link key={scan.id} href={`/scans/${scan.id}`} className="block p-4 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] hover:border-[#d1d5db] dark:hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] dark:bg-white/5 flex items-center justify-center text-[#6b7280]">
                      {getScanIcon(scan.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#9ca3af]">{scan.scanId}</span>
                        {scan.isDemo && <span className="text-[9px] px-1 py-0.5 rounded bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-medium">DEMO</span>}
                      </div>
                      <p className="text-[14px] font-medium text-[#111827] dark:text-white mt-0.5">{scan.target}</p>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5 capitalize">{scan.type === 'source-code' ? 'Source Code' : scan.type} &bull; {scan.completedAt ? formatDateTime(new Date(scan.completedAt)) : 'In Progress'}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 text-[11px] text-[#9ca3af]">
                      {scan.findingsCount.critical > 0 && <span className="text-red-500">{scan.findingsCount.critical}C</span>}
                      {scan.findingsCount.high > 0 && <span className="text-orange-500">{scan.findingsCount.high}H</span>}
                      {scan.findingsCount.medium > 0 && <span className="text-yellow-500">{scan.findingsCount.medium}M</span>}
                      {scan.findingsCount.low > 0 && <span>{scan.findingsCount.low}L</span>}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className={cn('text-[20px] font-light', getRiskColor(scan.riskScore))}>{scan.riskScore}</span>
                        <span className="text-[10px] text-[#9ca3af]">/100</span>
                      </div>
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full inline-block', verdict.bg, verdict.text)}>{verdict.label}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-12 text-center rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <p className="text-[14px] text-[#9ca3af]">No scans match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
