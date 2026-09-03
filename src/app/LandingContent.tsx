'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Shield, Globe, FileCode, Upload, ScanSearch, Bot, FileText, Lock, ChevronRight, ArrowRight, Eye, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target, duration]);

  return <div ref={ref} className="text-[48px] font-light tracking-tight text-white">{count.toLocaleString()}+</div>;
}

export default function LandingContent() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scanTarget, setScanTarget] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanActive, setScanActive] = useState(false);

  const startDemoScan = () => {
    if (!scanTarget.trim()) return;
    setScanActive(true);
    setScanProgress(0);
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 100) { setScanProgress(100); clearInterval(timer); setTimeout(() => setScanActive(false), 1500); }
      else setScanProgress(Math.floor(p));
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">SENTINELX</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[13px] text-neutral-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-[13px] text-neutral-400 hover:text-white transition-colors">How It Works</a>
            <a href="#security" className="text-[13px] text-neutral-400 hover:text-white transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block px-4 py-2 text-[13px] text-neutral-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/login" className="px-4 py-2 text-[13px] font-medium bg-white text-[#0a0a0a] rounded-lg hover:bg-neutral-200 transition-colors">Get Started</Link>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden text-neutral-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={mobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0a0a] px-6 py-4 space-y-3">
            <a href="#features" className="block text-[13px] text-neutral-400">Features</a>
            <a href="#how-it-works" className="block text-[13px] text-neutral-400">How It Works</a>
            <Link href="/login" className="block text-[13px] text-white">Sign In →</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-[1200px] mx-auto relative">
          <div className="max-w-[680px]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-medium text-neutral-400 tracking-wide uppercase">AI-Powered Security Analysis</span>
            </div>
            <h1 className="text-[56px] md:text-[72px] font-light leading-[1.05] tracking-[-0.03em]">
              Know Before<br />You <span className="font-normal">Trust.</span>
            </h1>
            <p className="text-[17px] text-neutral-400 mt-6 max-w-[480px] leading-relaxed">
              AI-assisted security analysis for websites, applications, and source-code projects. Identify threats before they become incidents.
            </p>
            <div className="flex items-center gap-4 mt-10">
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0a0a0a] text-[14px] font-medium rounded-lg hover:bg-neutral-200 transition-colors">
                Start Security Scan <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 text-neutral-300 text-[14px] rounded-lg hover:bg-white/5 transition-colors">
                View Demo
              </a>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 border border-white/5 rounded-2xl bg-white/[0.02] overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
              <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /></div>
              <span className="text-[11px] text-neutral-500 ml-2 font-mono">sentinelx.io/dashboard</span>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <ScanSearch className="w-4 h-4 text-neutral-500" />
                    <span className="text-[12px] text-neutral-500 font-medium">Quick Scan</span>
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={scanTarget} onChange={(e) => setScanTarget(e.target.value)} placeholder="Enter URL, upload file, or paste source code..." className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[14px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/20" />
                    <button onClick={startDemoScan} disabled={scanActive} className="px-5 py-3 bg-white text-[#0a0a0a] text-[13px] font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50">
                      {scanActive ? 'Scanning...' : 'Scan'}
                    </button>
                  </div>
                  {scanActive && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span>{scanProgress < 30 ? 'Validating target...' : scanProgress < 60 ? 'Running security analysis...' : scanProgress < 85 ? 'AI threat analysis...' : 'Generating report...'}</span>
                        <span>{scanProgress}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-white/80 rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                      </div>
                    </div>
                  )}
                  {!scanActive && scanProgress >= 100 && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/10 animate-fade-in">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-[13px] text-green-400 font-medium">Scan Complete</p>
                        <p className="text-[12px] text-neutral-500">Risk Score: 12/100 — Low Risk. No significant malicious indicators detected.</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {[{ label: 'Scans Today', value: '1,247', icon: Eye }, { label: 'Threats Blocked', value: '89', icon: AlertTriangle }, { label: 'Reports Generated', value: '423', icon: FileText }].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <stat.icon className="w-4 h-4 text-neutral-600" />
                      <div>
                        <p className="text-[11px] text-neutral-500">{stat.label}</p>
                        <p className="text-[16px] font-light text-white">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 flex items-center justify-center gap-8 text-[11px] text-neutral-600 uppercase tracking-widest">
            <span>SOC 2 Compliant</span>
            <span className="w-1 h-1 rounded-full bg-neutral-700" />
            <span>GDPR Ready</span>
            <span className="w-1 h-1 rounded-full bg-neutral-700" />
            <span>Zero Trust Architecture</span>
            <span className="w-1 h-1 rounded-full bg-neutral-700" />
            <span>Enterprise Grade</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[{ target: 50000, label: 'Scans Performed' }, { target: 12000, label: 'Threats Detected' }, { target: 850, label: 'Organizations' }, { target: 99, label: 'Uptime %' }].map((stat) => (
            <div key={stat.label}>
              <AnimatedCounter target={stat.target} />
              <p className="text-[13px] text-neutral-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Analyze */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[480px] mb-16">
            <p className="text-[11px] text-neutral-500 uppercase tracking-widest mb-3">Capabilities</p>
            <h2 className="text-[36px] font-light tracking-tight">What We Analyze</h2>
            <p className="text-[15px] text-neutral-400 mt-3">Three powerful scanning engines to identify threats across your attack surface.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: Globe, title: 'Website Security', desc: 'SSL/TLS, security headers, phishing indicators, malicious scripts, redirect chains, and domain reputation.', color: 'text-blue-400', border: 'border-blue-400/10' },
              { icon: Upload, title: 'Application Security', desc: 'Static analysis of EXE, APK, ZIP files for malware, suspicious code, embedded threats, and dangerous behaviors.', color: 'text-orange-400', border: 'border-orange-400/10' },
              { icon: FileCode, title: 'Source Code Security', desc: 'Hardcoded secrets, injection vulnerabilities, weak cryptography, unsafe configurations, and dependency issues.', color: 'text-purple-400', border: 'border-purple-400/10' },
            ].map((item) => (
              <div key={item.title} className={`p-8 rounded-2xl border ${item.border} bg-white/[0.01] hover:bg-white/[0.03] transition-colors group`}>
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-5 ${item.color}`}><item.icon className="w-5 h-5" /></div>
                <h3 className="text-[16px] font-medium mb-2">{item.title}</h3>
                <p className="text-[14px] text-neutral-400 leading-relaxed">{item.desc}</p>
                <div className="mt-6 flex items-center gap-1.5 text-[12px] text-neutral-500 group-hover:text-neutral-300 transition-colors"><span>Learn more</span><ChevronRight className="w-3 h-3" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Analysis */}
      <section id="security" className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="border border-white/5 rounded-2xl bg-white/[0.02] p-6">
            <div className="flex items-center gap-2 mb-4"><Bot className="w-4 h-4 text-purple-400" /><span className="text-[11px] text-purple-400 font-medium uppercase tracking-wider">AI-Assisted Analysis</span></div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/10">
                <p className="text-[12px] text-purple-400 font-medium mb-1">Threat Explanation</p>
                <p className="text-[13px] text-neutral-300 leading-relaxed">This website exhibits credential harvesting behavior. A login form submits credentials to an attacker-controlled server.</p>
              </div>
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-[12px] text-neutral-500 font-medium mb-1">Risk Assessment</p>
                <p className="text-[13px] text-neutral-300 leading-relaxed">Combined with obfuscated JavaScript and recently registered third-party resources, the overall risk is HIGH with 92% confidence.</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[11px] text-purple-400 uppercase tracking-widest mb-3">AI Security Analyst</p>
            <h2 className="text-[32px] font-light tracking-tight">Intelligence That<br />Explains Itself</h2>
            <p className="text-[15px] text-neutral-400 mt-4 leading-relaxed">Our AI doesn&apos;t just detect threats — it explains them in plain language, suggests fixes, and generates professional reports.</p>
            <div className="mt-8 space-y-3">
              {['Plain-language threat explanations', 'Automated risk scoring', 'Prioritized remediation plans', 'AI security chat assistant', 'False positive assessment', 'Executive summaries'].map((item) => (
                <div key={item} className="flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-purple-400" /><span className="text-[13px] text-neutral-300">{item}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[520px] mx-auto mb-16">
            <p className="text-[11px] text-neutral-500 uppercase tracking-widest mb-3">Process</p>
            <h2 className="text-[36px] font-light tracking-tight">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {[{ step: '01', title: 'Submit Target', desc: 'Enter a URL, upload a file, or submit source code', icon: Upload },
              { step: '02', title: 'Analyze', desc: 'Security engines scan for vulnerabilities and threats', icon: ScanSearch },
              { step: '03', title: 'Detect', desc: 'Threat detection identifies malicious indicators', icon: Eye },
              { step: '04', title: 'AI Review', desc: 'AI interprets findings and generates explanations', icon: Bot },
              { step: '05', title: 'Report', desc: 'Professional security report with actionable guidance', icon: FileText },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                <div className="text-center px-4 py-6">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4 bg-white/[0.02]"><item.icon className="w-5 h-5 text-neutral-400" /></div>
                  <p className="text-[10px] text-neutral-600 font-mono mb-1">STEP {item.step}</p>
                  <h4 className="text-[14px] font-medium mb-1">{item.title}</h4>
                  <p className="text-[12px] text-neutral-500">{item.desc}</p>
                </div>
                {i < 4 && <div className="hidden md:block absolute top-[42px] right-0 w-6 h-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[520px] mx-auto mb-16">
            <p className="text-[11px] text-neutral-500 uppercase tracking-widest mb-3">Platform</p>
            <h2 className="text-[36px] font-light tracking-tight">Built for Security Teams</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ icon: Shield, title: 'RBAC', desc: 'Role-based access control' }, { icon: Eye, title: 'Audit Logs', desc: 'Complete activity tracking' }, { icon: Bot, title: 'AI Chat', desc: 'Interactive security advisor' }, { icon: Cpu, title: 'Background Scan', desc: 'Non-blocking analysis' },
              { icon: FileText, title: 'PDF Reports', desc: 'Downloadable reports' }, { icon: Globe, title: 'Threat Map', desc: 'Global threat intelligence' }, { icon: Lock, title: 'Secure Upload', desc: 'Sandboxed file analysis' }, { icon: AlertTriangle, title: 'Real-time Alerts', desc: 'Instant threat notifications' },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                <item.icon className="w-5 h-5 text-neutral-400 mb-3" /><h4 className="text-[13px] font-medium mb-1">{item.title}</h4><p className="text-[12px] text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-[600px] mx-auto text-center">
          <h2 className="text-[40px] font-light tracking-tight">Start Securing<br />Your Assets Today</h2>
          <p className="text-[15px] text-neutral-400 mt-4">Free demo available. No credit card required.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0a0a0a] text-[14px] font-medium rounded-lg hover:bg-neutral-200 transition-colors mt-8">
            Start Free Scan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center"><Shield className="w-3.5 h-3.5 text-[#0a0a0a]" /></div>
            <span className="text-[14px] font-semibold tracking-tight">SENTINELX</span>
          </div>
          <div className="flex items-center gap-6 text-[12px] text-neutral-500">
            <span>Privacy</span><span>Terms</span><span>Security</span><span>Documentation</span>
          </div>
          <p className="text-[12px] text-neutral-600">© 2026 SentinelX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
