'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { demoScans, demoAIAnalyses } from '@/data/scans';
import { cn } from '@/lib/utils';
import { Bot, Send, User, Shield, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import { AIChatMessage } from '@/data/types';

const SUGGESTED_QUESTIONS = [
  'How can I secure my website?',
  'Why is my application risky?',
  'Which issue should I fix first?',
  'What does SQL injection mean?',
  'How do I improve my security posture?',
  'Explain the latest scan findings',
];

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome', role: 'assistant', timestamp: new Date(),
      content: 'Hello! I\'m your AI Security Advisor. I can help you understand security findings, suggest fixes, and answer questions about cybersecurity best practices. I\'ll use your scan results and general security knowledge to provide guidance.\n\nHow can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes('sql injection') || q.includes('sql')) {
      return 'SQL Injection is a vulnerability where an attacker can interfere with the queries an application makes to its database. It occurs when user input is directly inserted into SQL queries without proper sanitization.\n\n**Why it matters:** An attacker could potentially read sensitive data, modify database contents, or even gain administrative access.\n\n**How to fix it:**\n• Use parameterized queries or prepared statements\n• Use an ORM (Object-Relational Mapper)\n• Validate and sanitize all user inputs\n• Apply the principle of least privilege to database accounts\n\nYour scan found SQL injection in `app/models/user.py:42` using f-string interpolation. This should be your **top priority fix**.';
    }
    if (q.includes('secure my website') || q.includes('website security')) {
      return 'Here are the key steps to improve your website security:\n\n**Immediate Actions:**\n1. Implement HTTPS everywhere and redirect HTTP → HTTPS\n2. Add security headers (CSP, X-Frame-Options, HSTS)\n3. Keep all software and dependencies updated\n\n**Ongoing Practices:**\n4. Implement rate limiting on authentication endpoints\n5. Use strong, unique passwords and enable 2FA\n6. Regular security scans with SentinelX\n7. Monitor for suspicious activity\n\n**Advanced:**\n8. Implement a Web Application Firewall (WAF)\n9. Set up Content Security Policy\n10. Conduct regular penetration testing\n\nBased on your recent scans, I recommend starting with the missing security headers — that\'s a quick win with significant impact.';
    }
    if (q.includes('fix first') || q.includes('priority') || q.includes('which issue')) {
      const critical = demoScans.find((s) => s.findingsCount.critical > 0);
      return `Based on your scan history, here's the recommended fix priority:\n\n**FIX FIRST (Critical):**\n${critical ? `• ${critical.findingsCount.critical} critical issues in scan ${critical.scanId} — ${critical.target}` : '• No critical issues found in recent scans'}\n\n**FIX NEXT (High):**\n• Hardcoded credentials — these can be exploited immediately\n• Injection vulnerabilities — potential for data breach\n\n**FIX LATER (Medium/Low):**\n• Missing security headers\n• Information disclosure\n• Configuration improvements\n\nAlways address critical and high severity findings first, as they represent the most immediate risk to your systems.`;
    }
    if (q.includes('risky') || q.includes('risk')) {
      return 'Your application shows elevated risk due to several factors:\n\n**Key Risk Factors:**\n• Hardcoded credentials in source code — if exposed, attackers gain direct database access\n• SQL injection vulnerability — could allow complete data exfiltration\n• Command injection — could enable remote code execution\n• Weak password hashing — compromised passwords can be easily cracked\n\n**Risk Score Breakdown:**\nThe risk engine calculates scores based on finding severity, confidence levels, and potential impact. Your most recent scan scored 45/100 (Elevated) because of the combination of critical code-level vulnerabilities.\n\n**Recommendation:**\nFix the injection vulnerabilities immediately. Then rotate all credentials and move them to environment variables. These steps alone would significantly reduce your risk score.';
    }
    if (q.includes('improve') || q.includes('posture')) {
      return 'To improve your overall security posture:\n\n**Short-term wins:**\n1. Fix all critical and high-severity findings from recent scans\n2. Implement automated security scanning in your CI/CD pipeline\n3. Enable security headers across all web properties\n\n**Medium-term improvements:**\n1. Conduct a full code review focusing on OWASP Top 10\n2. Implement proper secrets management (e.g., HashiCorp Vault, AWS Secrets Manager)\n3. Set up continuous monitoring and alerting\n\n**Long-term strategy:**\n1. Establish a vulnerability management program\n2. Implement security training for developers\n3. Conduct regular penetration testing\n4. Achieve relevant security certifications\n\nBased on your current scans, resolving the critical issues in your source code project would improve your security posture by approximately 40%.';
    }
    return 'Based on your scan history and current security findings, here\'s what I can tell you:\n\nYour scans have identified a range of issues from low-risk configuration improvements to critical vulnerabilities. The most important findings are concentrated in your source code projects, where injection vulnerabilities and hardcoded credentials pose significant risk.\n\n**Key observations:**\n• Your website scans show generally good security with minor header improvements needed\n• File scans have identified some concerning indicators that warrant investigation\n• Source code scans reveal the most actionable security issues\n\nI recommend focusing your remediation efforts on the source code findings first, as they represent the most direct path to reducing your overall risk.\n\nWould you like me to dive deeper into any specific area?';
  };

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMsg: AIChatMessage = { id: Date.now().toString(), role: 'user', content: msg, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const aiMsg: AIChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: generateResponse(msg), timestamp: new Date(), sources: ['Scan Results', 'Security Knowledge Base'] };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <AppShell title="AI Security Advisor">
      <div className="max-w-[900px] mx-auto space-y-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">AI Security Advisor</h2>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">Ask questions about your security findings, best practices, and recommendations.</p>
        </div>

        {/* Context Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: 'Scans Analyzed', value: demoScans.length.toString(), color: 'text-blue-500' },
            { icon: AlertTriangle, label: 'Active Issues', value: '15', color: 'text-orange-500' },
            { icon: CheckCircle2, label: 'Resolved', value: '8', color: 'text-green-500' },
          ].map((c) => (
            <div key={c.label} className="p-4 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <c.icon className={cn('w-4 h-4 mb-2', c.color)} />
              <p className="text-[20px] font-light text-[#111827] dark:text-white">{c.value}</p>
              <p className="text-[11px] text-[#9ca3af]">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div className="rounded-xl border border-purple-200 dark:border-purple-800/30 bg-white dark:bg-[#0a0a0a] overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : '')}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-purple-500" />
                  </div>
                )}
                <div className={cn('max-w-[75%] p-4 rounded-xl', msg.role === 'user' ? 'bg-[#111827] dark:bg-white/10 text-white' : 'bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30')}>
                  <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources && (
                    <div className="flex gap-1.5 mt-3">
                      {msg.sources.map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[10px] text-[#9ca3af]">{msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.role === 'assistant' && <span className="text-[9px] text-purple-400 ml-1">AI-Assisted</span>}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-[#111827] dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-purple-500" />
                </div>
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/30">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-[#e5e7eb] dark:border-white/5 p-4">
            <div className="flex gap-2">
              <input
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about security, findings, or best practices..."
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-[#f8f9fa] dark:bg-white/5 text-[13px] text-[#111827] dark:text-white placeholder:text-[#9ca3af] focus:outline-none focus:border-purple-300 dark:focus:border-purple-700"
              />
              <button onClick={() => handleSend()} disabled={loading || !input.trim()} className="px-5 py-2.5 rounded-lg bg-purple-600 text-white text-[13px] font-medium hover:bg-purple-700 transition-colors disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="text-[13px] font-medium text-[#111827] dark:text-white">Suggested Questions</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button key={q} onClick={() => handleSend(q)} className="text-left p-3 rounded-lg border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] text-[12px] text-[#6b7280] dark:text-[#a3a3a3] hover:border-purple-300 dark:hover:border-purple-700 hover:text-[#111827] dark:hover:text-white transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
