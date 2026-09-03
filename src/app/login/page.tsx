'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('user@demo.com');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) router.push('/dashboard');
    else setError('Invalid credentials. Try the demo accounts below.');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#0a0a0a]" />
          </div>
          <span className="text-[16px] font-semibold tracking-tight text-white">SENTINELX</span>
        </div>

        {/* Card */}
        <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-8">
          <h1 className="text-[20px] font-medium text-white text-center">
            {isRegister ? 'Create Account' : 'Sign In'}
          </h1>
          <p className="text-[13px] text-neutral-500 text-center mt-1">
            {isRegister ? 'Start analyzing your assets' : 'Access your security dashboard'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[12px] text-neutral-400 mb-1.5">Full Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[14px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/20"
                  placeholder="Alex Morgan"
                />
              </div>
            )}
            <div>
              <label className="block text-[12px] text-neutral-400 mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[14px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/20"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-[12px] text-neutral-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[14px] text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/20 pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <p className="text-[12px] text-red-400">{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-white text-[#0a0a0a] text-[14px] font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="text-[13px] text-neutral-500 text-center mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-white hover:underline">
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 border border-white/5 rounded-xl bg-white/[0.01] p-5">
          <p className="text-[11px] text-neutral-500 uppercase tracking-wider mb-3 text-center">Demo Accounts</p>
          <div className="space-y-2">
            {[
              { role: 'User', email: 'user@demo.com', desc: 'Submit scans, view reports' },
              { role: 'Analyst', email: 'analyst@demo.com', desc: 'Investigate findings' },
              { role: 'Admin', email: 'admin@demo.com', desc: 'Manage platform' },
            ].map((acc) => (
              <button
                key={acc.email}
                onClick={() => { setEmail(acc.email); setPassword('demo123'); setError(''); }}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors text-left"
              >
                <div>
                  <p className="text-[13px] text-white font-medium">{acc.role}</p>
                  <p className="text-[11px] text-neutral-500">{acc.desc}</p>
                </div>
                <span className="text-[11px] text-neutral-500 font-mono">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
