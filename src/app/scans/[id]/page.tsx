'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { demoScans, demoFindings, demoRiskBreakdowns, demoTimelines, demoAIAnalyses, demoReports } from '@/data/scans';
import { cn, formatDateTime, getSeverityColor, getRiskColor } from '@/lib/utils';
import {
  Globe, Upload, FileCode, Clock, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Bot, FileText, ArrowLeft, MessageSquare, Send, Shield, Info, ExternalLink,
} from 'lucide-react';
import { Finding, AIChatMessage } from '@/data/types';

export default function ScanDetailPage() {
  const params = useParams();
  const scanId = params?.id as string;
  const scan = demoScans.find((s) => s.id === scanId);
  const findings = demoFindings[scanId] || [];
  const riskBreakdown = demoRiskBreakdowns[scanId];
  const timeline = demoTimelines[scanId] || [];
  const aiAnalysis = demoAIAnalyses[scanId];
  const report = demoReports[scanId];

  const [activeTab, setActiveTab] = useState<'overview' | 'findings' | 'technical' | 'ai' | 'remediation'>('overview');
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);
  const [showRiskDetail, setShowRiskDetail] = useState(false);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  if (!scan) {
    return (
      <AppShell title="Scan Details">
        <div className="max-w-[800px] mx-auto text-center py-20">
          <p className="text-[16px] text-[#6b7280] dark:text-[#a3a3a3]">Scan not found.</p>
          <Link href="/dashboard" className="text-[13px] text-[#111827] dark:text-white mt-4 inline-block hover:underline">← Back to Dashboard</Link>
        </div>
      </AppShell>
    );
  }

  const getScanIcon = () => {
    if (scan.type === 'website') return <Globe className="w-5 h-5" />;
    if (scan.type === 'file') return <Upload className="w-5 h-5" />;
    return <FileCode className="w-5 h-5" />;
  };

  const getVerdictDisplay = () => {
    switch (scan.verdict) {
      case 'SAFE': case 'LOW_RISK': return { icon: CheckCircle2, text: 'LOW RISK', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800' };
      case 'MODERATE': return { icon: Info, text: 'MODERATE', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-200 dark:border-yellow-800' };
      case 'SUSPICIOUS': return { icon: AlertTriangle, text: 'SUSPICIOUS', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800' };
      case 'HIGH_RISK': return { icon: AlertTriangle, text: 'HIGH RISK', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800' };
      case 'CRITICAL': return { icon: XCircle, text: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800' };
      default: return { icon: Info, text: scan.verdict, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-950/30', border: 'border-gray-200 dark:border-gray-800' };
    }
  };

  const verdict = getVerdictDisplay();
  const VerdictIcon = verdict.icon;

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg: AIChatMessage = { id: Date.now().toString(), role: 'user', content: chatInput, timestamp: new Date() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const aiMsg: AIChatMessage = {
      id: (Date.now() + 1).toString(), role: 'assistant', timestamp: new Date(),
      content: `Based on the scan findings for ${scan.target}: ${aiAnalysis?.threatExplanation || 'The analysis indicates several security concerns that should be addressed. The findings suggest reviewing the specific issues identified in the detailed findings tab for more context.'}`,
      sources: ['Security Engine Analysis', 'AI Threat Assessment'],
    };
    setChatMessages((prev) => [...prev, aiMsg]);
    setChatLoading(false);
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'findings' as const, label: `Findings (${findings.length})` },
    { id: 'technical' as const, label: 'Technical Details' },
    { id: 'ai' as const, label: 'AI Analysis' },
    { id: 'remediation' as const, label: 'Remediation' },
  ];

  return (
    <AppShell title="Scan Details">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Back + Header */}
        <div>
          <Link href="/scans" className="text-[12px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white flex items-center gap-1 mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to Scans
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f3f4f6] dark:bg-white/5 flex items-center justify-center text-[#6b7280]">
                {getScanIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-mono text-[#9ca3af]">{scan.scanId}</span>
                  {scan.isDemo && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-medium">DEMO</span>}
                </div>
                <h2 className="text-[18px] font-semibold text-[#111827] dark:text-white mt-1">{scan.target}</h2>
                <p className="text-[12px] text-[#9ca3af] mt-0.5 capitalize">{scan.type === 'source-code' ? 'Source Code' : scan.type} scan • Submitted {formatDateTime(scan.submittedAt)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl border', verdict.bg, verdict.border)}>
                <VerdictIcon className={cn('w-5 h-5', verdict.color)} />
                <span className={cn('text-[14px] font-semibold', verdict.color)}>{verdict.text}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score + Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="col-span-2 md:col-span-1 p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
            <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-2">Risk Score</p>
            <div className="flex items-end gap-1">
              <span className={cn('text-[32px] font-light', getRiskColor(scan.riskScore))}>{scan.riskScore}</span>
              <span className="text-[12px] text-[#9ca3af] mb-1">/100</span>
            </div>
            <button onClick={() => setShowRiskDetail(!showRiskDetail)} className="text-[11px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white mt-1 flex items-center gap-1">
              Why this score? {showRiskDetail ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
          {[
            { label: 'Critical', value: scan.findingsCount.critical, color: 'text-red-500' },
            { label: 'High', value: scan.findingsCount.high, color: 'text-orange-500' },
            { label: 'Medium', value: scan.findingsCount.medium, color: 'text-yellow-500' },
            { label: 'Low / Info', value: scan.findingsCount.low + scan.findingsCount.info, color: 'text-blue-500' },
          ].map((s) => (
            <div key={s.label} className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-2">{s.label}</p>
              <p className={cn('text-[28px] font-light', s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Risk Breakdown */}
        {showRiskDetail && riskBreakdown && (
          <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] animate-fade-in">
            <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Risk Score Breakdown</h3>
            <div className="space-y-3">
              {riskBreakdown.factors.map((f) => (
                <div key={f.factor}>
                  <div className="flex items-center justify-between text-[12px] mb-1">
                    <span className="text-[#6b7280] dark:text-[#a3a3a3]">{f.factor}</span>
                    <span className="text-[#111827] dark:text-white font-medium">+{f.score}</span>
                  </div>
                  <div className="h-1.5 bg-[#f3f4f6] dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#111827] dark:bg-white/80 rounded-full" style={{ width: `${f.score}%` }} />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-[#f3f4f6] dark:border-white/5">
                <span className="text-[13px] font-medium text-[#111827] dark:text-white">Final Score</span>
                <span className={cn('text-[16px] font-semibold', getRiskColor(scan.riskScore))}>{scan.riskScore}/100</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#e5e7eb] dark:border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'border-[#111827] dark:border-white text-[#111827] dark:text-white'
                  : 'border-transparent text-[#6b7280] dark:text-[#a3a3a3] hover:text-[#111827] dark:hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Scan Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Scan Information</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Scan ID', value: scan.scanId },
                    { label: 'Target', value: scan.target },
                    { label: 'Type', value: scan.type === 'source-code' ? 'Source Code' : scan.type },
                    { label: 'Status', value: scan.status },
                    { label: 'Submitted', value: formatDateTime(scan.submittedAt) },
                    { label: 'Completed', value: scan.completedAt ? formatDateTime(scan.completedAt) : '—' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1.5">
                      <span className="text-[12px] text-[#9ca3af]">{item.label}</span>
                      <span className="text-[12px] font-medium text-[#111827] dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Executive Summary</h3>
                <p className="text-[13px] text-[#6b7280] dark:text-[#a3a3a3] leading-relaxed">
                  {report?.executiveSummary || 'Analysis in progress...'}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-4">Scan Timeline</h3>
              <div className="space-y-0">
                {timeline.map((step, i) => (
                  <div key={step.stage} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn('w-3 h-3 rounded-full border-2 flex-shrink-0', step.status === 'completed' ? 'bg-[#111827] dark:bg-white border-[#111827] dark:border-white' : step.status === 'current' ? 'bg-white dark:bg-[#0a0a0a] border-[#111827] dark:border-white' : 'bg-white dark:bg-[#0a0a0a] border-[#e5e7eb] dark:border-white/20')} />
                      {i < timeline.length - 1 && <div className={cn('w-px h-8', step.status === 'completed' ? 'bg-[#111827] dark:bg-white/20' : 'bg-[#e5e7eb] dark:bg-white/5')} />}
                    </div>
                    <div className="pb-6">
                      <p className={cn('text-[13px] font-medium', step.status === 'completed' ? 'text-[#111827] dark:text-white' : 'text-[#9ca3af]')}>{step.stage}</p>
                      <p className="text-[11px] text-[#9ca3af]">{formatDateTime(step.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'findings' && (
          <div className="space-y-3 animate-fade-in">
            {findings.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-[14px] text-[#6b7280] dark:text-[#a3a3a3]">No findings detected</p>
              </div>
            ) : (
              findings.map((finding) => {
                const expanded = expandedFinding === finding.id;
                const sev = getSeverityColor(finding.severity);
                return (
                  <div key={finding.id} className="rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] overflow-hidden">
                    <button
                      onClick={() => setExpandedFinding(expanded ? null : finding.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#f8f9fa] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded', sev.bg, sev.text)}>
                          {finding.severity.toUpperCase()}
                        </span>
                        <span className="text-[13px] font-medium text-[#111827] dark:text-white">{finding.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#9ca3af]">{finding.confidence}% confidence</span>
                        {expanded ? <ChevronUp className="w-4 h-4 text-[#9ca3af]" /> : <ChevronDown className="w-4 h-4 text-[#9ca3af]" />}
                      </div>
                    </button>
                    {expanded && (
                      <div className="px-4 pb-4 border-t border-[#f3f4f6] dark:border-white/5 pt-4 space-y-3 animate-fade-in">
                        <div>
                          <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Description</p>
                          <p className="text-[13px] text-[#6b7280] dark:text-[#a3a3a3]">{finding.description}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Evidence</p>
                          <p className="text-[12px] font-mono text-[#111827] dark:text-white bg-[#f3f4f6] dark:bg-white/5 p-3 rounded-lg">{finding.evidence}</p>
                        </div>
                        {finding.location && (
                          <div className="flex gap-4">
                            <div>
                              <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Location</p>
                              <p className="text-[12px] text-[#6b7280] dark:text-[#a3a3a3]">{finding.location}</p>
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Impact</p>
                          <p className="text-[13px] text-[#6b7280] dark:text-[#a3a3a3]">{finding.impact}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#9ca3af] uppercase tracking-wider mb-1">Recommendation</p>
                          <p className="text-[13px] text-[#6b7280] dark:text-[#a3a3a3]">{finding.recommendation}</p>
                        </div>
                        {finding.aiExplanation && (
                          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Bot className="w-3.5 h-3.5 text-purple-500" />
                              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">AI-Assisted Explanation</span>
                            </div>
                            <p className="text-[12px] text-purple-700 dark:text-purple-300">{finding.aiExplanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] animate-fade-in">
            <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Technical Details</h3>
            <div className="space-y-4">
              {findings.filter((f) => f.file || f.location).map((f) => (
                <div key={f.id} className="p-4 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02] border border-[#f3f4f6] dark:border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded', getSeverityColor(f.severity).bg, getSeverityColor(f.severity).text)}>
                      {f.severity.toUpperCase()}
                    </span>
                    <span className="text-[13px] font-medium text-[#111827] dark:text-white">{f.title}</span>
                  </div>
                  {f.file && <p className="text-[12px] font-mono text-[#6b7280] dark:text-[#a3a3a3]">📄 {f.file}{f.line ? `:${f.line}` : ''}</p>}
                  <p className="text-[12px] font-mono text-[#9ca3af] mt-2 bg-[#111827] dark:bg-black/50 text-green-400 dark:text-green-300 p-3 rounded-lg">{f.evidence}</p>
                </div>
              ))}
              {findings.filter((f) => f.file || f.location).length === 0 && (
                <p className="text-[13px] text-[#9ca3af]">No file-level technical details available for this scan type.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6 animate-fade-in">
            {aiAnalysis && (
              <>
                <div className="p-5 rounded-xl border border-purple-200 dark:border-purple-800/30 bg-white dark:bg-[#0a0a0a]">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-4 h-4 text-purple-500" />
                    <span className="text-[13px] font-semibold text-[#111827] dark:text-white">AI Threat Explanation</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400">AI-Assisted</span>
                  </div>
                  <p className="text-[13px] text-[#6b7280] dark:text-[#a3a3a3] leading-relaxed">{aiAnalysis.threatExplanation}</p>
                </div>
                <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                  <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">AI Risk Summary</h3>
                  <p className="text-[13px] text-[#6b7280] dark:text-[#a3a3a3] leading-relaxed">{aiAnalysis.riskSummary}</p>
                </div>
                {aiAnalysis.falsePositiveAssessment && (
                  <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                    <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">False Positive Assessment</h3>
                    <p className="text-[13px] text-[#6b7280] dark:text-[#a3a3a3] leading-relaxed">{aiAnalysis.falsePositiveAssessment}</p>
                  </div>
                )}
              </>
            )}

            {/* AI Chat */}
            <div className="p-5 rounded-xl border border-purple-200 dark:border-purple-800/30 bg-white dark:bg-[#0a0a0a]">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span className="text-[13px] font-semibold text-[#111827] dark:text-white">AI Security Chat</span>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto mb-4">
                {chatMessages.length === 0 && (
                  <p className="text-[12px] text-[#9ca3af] text-center py-8">Ask the AI about this scan&apos;s findings, risks, or recommendations.</p>
                )}
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={cn('p-3 rounded-lg max-w-[85%]', msg.role === 'user' ? 'bg-[#111827] dark:bg-white/10 text-white ml-auto' : 'bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30')}>
                    <p className="text-[12px] leading-relaxed">{msg.content}</p>
                    {msg.sources && (
                      <div className="flex gap-1.5 mt-2">
                        {msg.sources.map((s) => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-purple-400">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {chatLoading && (
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30 max-w-[85%]">
                    <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /><div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse [animation-delay:0.2s]" /><div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse [animation-delay:0.4s]" /></div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ask about this scan's findings..."
                  className="flex-1 px-3 py-2 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-[#f8f9fa] dark:bg-white/5 text-[13px] text-[#111827] dark:text-white placeholder:text-[#9ca3af] focus:outline-none focus:border-purple-300 dark:focus:border-purple-700"
                />
                <button onClick={handleSendChat} disabled={chatLoading || !chatInput.trim()} className="px-4 py-2 rounded-lg bg-purple-600 text-white text-[13px] font-medium hover:bg-purple-700 transition-colors disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'remediation' && report && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-3">Final Recommendation</h3>
              <p className="text-[13px] text-[#6b7280] dark:text-[#a3a3a3] leading-relaxed">{report.finalRecommendation}</p>
            </div>
            <div className="p-5 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Remediation Plan</h3>
              <div className="space-y-3">
                {report.remediationPlan.map((step, i) => {
                  const sev = getSeverityColor(step.severity);
                  return (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02] border border-[#f3f4f6] dark:border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-[#111827] dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[12px] font-semibold text-white dark:text-white">P{step.priority}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] font-medium text-[#111827] dark:text-white">{step.title}</span>
                          <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', sev.bg, sev.text)}>
                            {step.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#6b7280] dark:text-[#a3a3a3]">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {report && (
              <button className="w-full py-3 border border-[#e5e7eb] dark:border-white/10 rounded-xl text-[13px] font-medium text-[#6b7280] dark:text-[#a3a3a3] hover:bg-[#f8f9fa] dark:hover:bg-white/[0.02] transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Download PDF Report
              </button>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
