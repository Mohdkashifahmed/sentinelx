'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import { cn } from '@/lib/utils';
import { Globe, Upload, FileCode, ArrowRight, Shield, AlertTriangle, Lock, CheckCircle2, Loader2 } from 'lucide-react';

type ScanOption = 'website' | 'file' | 'source-code' | null;

const API_BASE = 'https://sentinelx-backend-jucx.onrender.com';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sentinelx_token');
}

export default function NewScanPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ScanOption>(null);
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');

  const handleWebsiteScan = async () => {
    if (!url.trim()) { setError('Please enter a URL'); return; }
    try { new URL(url); } catch { setError('Please enter a valid URL including https://'); return; }
    setError('');
    setScanning(true);

    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/scans/website`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || 'Scan failed');
      }

      const data = await res.json();
      router.push(`/scans/${data.scan_id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Scan failed. Please try again.');
      setScanning(false);
    }
  };

  const handleFileScan = async () => {
    if (!file) { setError('Please select a file'); return; }
    if (file.size > 100 * 1024 * 1024) { setError('File size must be under 100MB'); return; }
    setError('');
    setScanning(true);

    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/api/scans/file`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || 'Scan failed');
      }

      const data = await res.json();
      router.push(`/scans/${data.scan_id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Scan failed. Please try again.');
      setScanning(false);
    }
  };

  const handleSourceScan = async () => {
    if (!sourceFile) { setError('Please select a ZIP file'); return; }
    if (!sourceFile.name.endsWith('.zip')) { setError('Please upload a .zip file'); return; }
    setError('');
    setScanning(true);

    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('file', sourceFile);

      const res = await fetch(`${API_BASE}/api/scans/source-code`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || 'Scan failed');
      }

      const data = await res.json();
      router.push(`/scans/${data.scan_id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Scan failed. Please try again.');
      setScanning(false);
    }
  };

  return (
    <AppShell title="New Security Scan">
      <div className="max-w-[800px] mx-auto space-y-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">New Security Scan</h2>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">Select a scan type and provide your target for analysis.</p>
        </div>

        {/* Scan Type Selection */}
        {!selected && (
          <div className="space-y-4">
            {[
              { type: 'website' as const, icon: Globe, title: 'Website Security Scan', desc: 'Analyze a website URL for security threats, misconfigurations, and suspicious behavior.', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', checks: ['SSL/TLS Analysis', 'Security Headers', 'Phishing Detection', 'Malicious Scripts'] },
              { type: 'file' as const, icon: Upload, title: 'Application / File Scan', desc: 'Upload EXE, APK, ZIP, or scripts for static analysis and threat detection.', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-200 dark:border-orange-800', checks: ['File Metadata', 'Malware Indicators', 'Suspicious Strings', 'Dangerous Permissions'] },
              { type: 'source-code' as const, icon: FileCode, title: 'Source Code Security Scan', desc: 'Upload a source code ZIP project to detect vulnerabilities and security issues.', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', checks: ['Hardcoded Secrets', 'Injection Vulnerabilities', 'Weak Cryptography', 'Insecure Config'] },
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => setSelected(option.type)}
                className={cn('w-full text-left p-6 rounded-xl border transition-all hover:shadow-sm', option.border, 'border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#0a0a0a] hover:border-[#d1d5db] dark:hover:border-white/20')}
              >
                <div className="flex items-start gap-5">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', option.bg)}>
                    <option.icon className={cn('w-5 h-5', option.color)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white">{option.title}</h3>
                    <p className="text-[13px] text-[#6b7280] dark:text-[#a3a3a3] mt-1">{option.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {option.checks.map((c) => (
                        <span key={c} className="text-[11px] px-2 py-1 rounded-md bg-[#f3f4f6] dark:bg-white/5 text-[#6b7280] dark:text-[#a3a3a3]">{c}</span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#9ca3af] mt-3" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Website Scan Form */}
        {selected === 'website' && (
          <div className="space-y-4 animate-fade-in">
            <button onClick={() => { setSelected(null); setError(''); }} className="text-[13px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white">
              &larr; Back to scan types
            </button>
            <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
              <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-1">Website URL</h3>
              <p className="text-[13px] text-[#9ca3af] mb-4">Enter the URL of the website you want to analyze.</p>
              <input
                type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-[#f8f9fa] dark:bg-white/5 text-[14px] text-[#111827] dark:text-white placeholder:text-[#9ca3af] focus:outline-none focus:border-[#d1d5db] dark:focus:border-white/20"
              />
              {error && <p className="text-[12px] text-red-500 mt-2">{error}</p>}
              <div className="mt-4 p-3 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02] border border-[#f3f4f6] dark:border-white/5">
                <p className="text-[12px] text-[#6b7280] dark:text-[#a3a3a3] font-medium mb-2">What we analyze:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {['SSL/TLS certificate', 'Security headers', 'HTTPS enforcement', 'Phishing indicators', 'Malicious scripts', 'Redirect behavior', 'External resources', 'Domain reputation'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-[#6b7280] dark:text-[#a3a3a3]">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/30">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[12px] text-yellow-700 dark:text-yellow-400">URLs pointing to private networks, localhost, or internal systems will be blocked for security.</p>
                </div>
              </div>
              <button onClick={handleWebsiteScan} disabled={scanning || !url.trim()} className="mt-4 w-full py-3 bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning...</> : <><Shield className="w-4 h-4" /> Start Website Scan</>}
              </button>
            </div>
          </div>
        )}

        {/* File Scan Form */}
        {selected === 'file' && (
          <div className="space-y-4 animate-fade-in">
            <button onClick={() => { setSelected(null); setError(''); setFile(null); }} className="text-[13px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white">
              &larr; Back to scan types
            </button>
            <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
              <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-1">Upload Application File</h3>
              <p className="text-[13px] text-[#9ca3af] mb-4">Upload EXE, APK, ZIP, scripts, or other files for static analysis.</p>
              <div className="border-2 border-dashed border-[#e5e7eb] dark:border-white/10 rounded-xl p-8 text-center hover:border-[#d1d5db] dark:hover:border-white/20 transition-colors cursor-pointer" onClick={() => document.getElementById('file-input')?.click()}>
                <Upload className="w-8 h-8 text-[#9ca3af] mx-auto mb-3" />
                {file ? (
                  <div>
                    <p className="text-[14px] font-medium text-[#111827] dark:text-white">{file.name}</p>
                    <p className="text-[12px] text-[#9ca3af] mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[14px] text-[#6b7280] dark:text-[#a3a3a3]">Click to select a file</p>
                    <p className="text-[12px] text-[#9ca3af] mt-1">Supported: EXE, APK, ZIP, .py, .js, .sh — Max 100MB</p>
                  </div>
                )}
                <input id="file-input" type="file" className="hidden" accept=".exe,.apk,.zip,.py,.js,.sh,.bat,.ps1,.dll,.scr,.com,.msi" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              {error && <p className="text-[12px] text-red-500 mt-2">{error}</p>}
              <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[12px] text-blue-700 dark:text-blue-400">Uploaded files are analyzed in an isolated sandbox. Files are never executed directly on the server.</p>
                </div>
              </div>
              <button onClick={handleFileScan} disabled={scanning || !file} className="mt-4 w-full py-3 bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing File...</> : <><Shield className="w-4 h-4" /> Start File Scan</>}
              </button>
            </div>
          </div>
        )}

        {/* Source Code Scan Form */}
        {selected === 'source-code' && (
          <div className="space-y-4 animate-fade-in">
            <button onClick={() => { setSelected(null); setError(''); setSourceFile(null); }} className="text-[13px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white">
              &larr; Back to scan types
            </button>
            <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
              <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white mb-1">Upload Source Code Project</h3>
              <p className="text-[13px] text-[#9ca3af] mb-4">Upload a ZIP archive of your source code project for security analysis.</p>
              <div className="border-2 border-dashed border-[#e5e7eb] dark:border-white/10 rounded-xl p-8 text-center hover:border-[#d1d5db] dark:hover:border-white/20 transition-colors cursor-pointer" onClick={() => document.getElementById('source-input')?.click()}>
                <FileCode className="w-8 h-8 text-[#9ca3af] mx-auto mb-3" />
                {sourceFile ? (
                  <div>
                    <p className="text-[14px] font-medium text-[#111827] dark:text-white">{sourceFile.name}</p>
                    <p className="text-[12px] text-[#9ca3af] mt-1">{(sourceFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[14px] text-[#6b7280] dark:text-[#a3a3a3]">Click to select a ZIP file</p>
                    <p className="text-[12px] text-[#9ca3af] mt-1">Upload your project as a .zip archive</p>
                  </div>
                )}
                <input id="source-input" type="file" className="hidden" accept=".zip" onChange={(e) => setSourceFile(e.target.files?.[0] || null)} />
              </div>
              {error && <p className="text-[12px] text-red-500 mt-2">{error}</p>}
              <div className="mt-4 p-3 rounded-lg bg-[#f8f9fa] dark:bg-white/[0.02] border border-[#f3f4f6] dark:border-white/5">
                <p className="text-[12px] text-[#6b7280] dark:text-[#a3a3a3] font-medium mb-2">What we scan for:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Hardcoded credentials', 'SQL injection', 'Command injection', 'Weak cryptography', 'Insecure configs', 'Debug mode', 'Sensitive data', 'Dangerous functions'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-[#6b7280] dark:text-[#a3a3a3]">
                      <CheckCircle2 className="w-3 h-3 text-purple-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleSourceScan} disabled={scanning || !sourceFile} className="mt-4 w-full py-3 bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Source Code...</> : <><Shield className="w-4 h-4" /> Start Source Code Scan</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
