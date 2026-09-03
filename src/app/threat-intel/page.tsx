'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { cn } from '@/lib/utils';
import { Globe, AlertTriangle, Shield, Activity } from 'lucide-react';

const threatLocations = [
  { country: 'United States', code: 'US', scans: 1247, suspicious: 34, highRisk: 12, critical: 3, x: 22, y: 38 },
  { country: 'China', code: 'CN', scans: 423, suspicious: 89, highRisk: 23, critical: 7, x: 75, y: 35 },
  { country: 'Russia', code: 'RU', scans: 312, suspicious: 67, highRisk: 18, critical: 5, x: 68, y: 25 },
  { country: 'Germany', code: 'DE', scans: 567, suspicious: 12, highRisk: 4, critical: 1, x: 51, y: 30 },
  { country: 'Brazil', code: 'BR', scans: 234, suspicious: 23, highRisk: 8, critical: 2, x: 30, y: 65 },
  { country: 'India', code: 'IN', scans: 389, suspicious: 45, highRisk: 15, critical: 4, x: 70, y: 45 },
  { country: 'United Kingdom', code: 'GB', scans: 456, suspicious: 8, highRisk: 3, critical: 0, x: 47, y: 28 },
  { country: 'Japan', code: 'JP', scans: 298, suspicious: 11, highRisk: 5, critical: 1, x: 83, y: 35 },
  { country: 'Nigeria', code: 'NG', scans: 156, suspicious: 78, highRisk: 34, critical: 12, x: 49, y: 52 },
  { country: 'South Korea', code: 'KR', scans: 189, suspicious: 7, highRisk: 2, critical: 0, x: 80, y: 37 },
];

const recentThreats = [
  { id: 't1', type: 'Phishing Campaign', origin: 'Nigeria', target: 'Financial institutions', severity: 'critical', time: '2h ago', indicators: 47 },
  { id: 't2', type: 'Credential Stuffing', origin: 'China', target: 'E-commerce platforms', severity: 'high', time: '4h ago', indicators: 23 },
  { id: 't3', type: 'Malware Distribution', origin: 'Russia', target: 'Software updates', severity: 'critical', time: '6h ago', indicators: 31 },
  { id: 't4', type: 'DDoS Activity', origin: 'Brazil', target: 'Web services', severity: 'medium', time: '8h ago', indicators: 15 },
  { id: 't5', type: 'SQL Injection Attempts', origin: 'India', target: 'Web applications', severity: 'high', time: '12h ago', indicators: 89 },
];

export default function ThreatIntelPage() {
  const [selectedLocation, setSelectedLocation] = useState<typeof threatLocations[0] | null>(null);

  return (
    <AppShell title="Threat Intelligence">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">Threat Intelligence</h2>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">Global threat activity and scan origin analysis.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Global Scans', value: '3,871', icon: Globe, color: 'text-blue-500' },
            { label: 'Suspicious Activity', value: '374', icon: AlertTriangle, color: 'text-orange-500' },
            { label: 'High Risk Regions', value: '4', icon: Shield, color: 'text-red-500' },
            { label: 'Active Threats', value: '12', icon: Activity, color: 'text-purple-500' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <s.icon className={cn('w-4 h-4 mb-2', s.color)} />
              <p className="text-[22px] font-light text-[#111827] dark:text-white">{s.value}</p>
              <p className="text-[11px] text-[#9ca3af]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* World Map */}
        <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
          <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Global Threat Map</h3>
          <div className="relative w-full aspect-[2/1] bg-[#f8f9fa] dark:bg-white/[0.02] rounded-lg overflow-hidden border border-[#f3f4f6] dark:border-white/5">
            {/* Simple world map outline using CSS */}
            <svg viewBox="0 0 100 50" className="w-full h-full opacity-20 dark:opacity-10">
              <ellipse cx="50" cy="25" rx="45" ry="22" fill="none" stroke="currentColor" strokeWidth="0.3" />
              <ellipse cx="50" cy="25" rx="30" ry="22" fill="none" stroke="currentColor" strokeWidth="0.2" />
              <line x1="5" y1="25" x2="95" y2="25" stroke="currentColor" strokeWidth="0.1" />
              <line x1="50" y1="3" x2="50" y2="47" stroke="currentColor" strokeWidth="0.1" />
            </svg>

            {/* Threat Markers */}
            {threatLocations.map((loc) => (
              <button
                key={loc.code}
                onClick={() => setSelectedLocation(selectedLocation?.code === loc.code ? null : loc)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              >
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 transition-all hover:scale-150',
                  loc.critical > 5 ? 'bg-red-500 border-red-300 animate-pulse' :
                  loc.highRisk > 10 ? 'bg-orange-500 border-orange-300' :
                  loc.suspicious > 30 ? 'bg-yellow-500 border-yellow-300' :
                  'bg-green-500 border-green-300'
                )} />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-medium text-[#6b7280] dark:text-[#a3a3a3] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {loc.code}
                </span>
              </button>
            ))}

            {/* Selected Location Detail */}
            {selectedLocation && (
              <div className="absolute top-4 right-4 w-[240px] p-4 rounded-xl bg-white dark:bg-[#111111] border border-[#e5e7eb] dark:border-white/10 shadow-lg animate-fade-in">
                <h4 className="text-[14px] font-semibold text-[#111827] dark:text-white">{selectedLocation.country}</h4>
                <div className="mt-3 space-y-2">
                  {[
                    { label: 'Total Scans', value: selectedLocation.scans, color: 'text-[#111827] dark:text-white' },
                    { label: 'Suspicious', value: selectedLocation.suspicious, color: 'text-yellow-500' },
                    { label: 'High Risk', value: selectedLocation.highRisk, color: 'text-orange-500' },
                    { label: 'Critical', value: selectedLocation.critical, color: 'text-red-500' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-[12px] text-[#9ca3af]">{s.label}</span>
                      <span className={cn('text-[13px] font-medium', s.color)}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Threats */}
        <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
          <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Recent Threat Activity</h3>
          <div className="space-y-3">
            {recentThreats.map((threat) => (
              <div key={threat.id} className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02] border border-[#f3f4f6] dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full', threat.severity === 'critical' ? 'bg-red-500' : threat.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500')} />
                  <div>
                    <p className="text-[13px] font-medium text-[#111827] dark:text-white">{threat.type}</p>
                    <p className="text-[11px] text-[#9ca3af]">Origin: {threat.origin} • Target: {threat.target}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', threat.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400' : threat.severity === 'high' ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400' : 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400')}>
                    {threat.severity.toUpperCase()}
                  </span>
                  <p className="text-[10px] text-[#9ca3af] mt-1">{threat.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
