'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { User, Bell, Shield, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true, scanComplete: true, highRisk: true, reportReady: true, analystReview: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell title="Settings">
      <div className="max-w-[800px] mx-auto space-y-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">Settings</h2>
          <p className="text-[13px] text-[#9ca3af] mt-0.5">Manage your account settings and preferences.</p>
        </div>

        <div className="flex gap-1 border-b border-[#e5e7eb] dark:border-white/5">
          {[
            { id: 'profile' as const, label: 'Profile', icon: User },
            { id: 'notifications' as const, label: 'Notifications', icon: Bell },
            { id: 'security' as const, label: 'Security', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn('flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 -mb-px', activeTab === tab.id ? 'border-[#111827] dark:border-white text-[#111827] dark:text-white' : 'border-transparent text-[#6b7280] hover:text-[#111827]')}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] space-y-4 animate-fade-in">
            <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white">Profile Information</h3>
            <div>
              <label className="block text-[12px] text-[#9ca3af] mb-1.5">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-[#f8f9fa] dark:bg-white/5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#d1d5db]" />
            </div>
            <div>
              <label className="block text-[12px] text-[#9ca3af] mb-1.5">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-[#f8f9fa] dark:bg-white/5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#d1d5db]" />
            </div>
            <div>
              <label className="block text-[12px] text-[#9ca3af] mb-1.5">Role</label>
              <input value={user?.role || 'user'} disabled className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-[#f3f4f6] dark:bg-white/[0.02] text-[13px] text-[#9ca3af]" />
            </div>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a] text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity">
              {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] space-y-4 animate-fade-in">
            <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white">Notification Preferences</h3>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[13px] text-[#111827] dark:text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-[11px] text-[#9ca3af]">Receive notifications for this event</p>
                </div>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={cn('w-10 h-6 rounded-full transition-colors relative', value ? 'bg-[#111827] dark:bg-white' : 'bg-[#e5e7eb] dark:bg-white/10')}
                >
                  <div className={cn('w-4 h-4 rounded-full bg-white dark:bg-[#0a0a0a] absolute top-1 transition-transform', value ? 'translate-x-5' : 'translate-x-1')} />
                </button>
              </div>
            ))}
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a] text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity">
              {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Preferences</>}
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] space-y-4">
              <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white">Password</h3>
              <div>
                <label className="block text-[12px] text-[#9ca3af] mb-1.5">Current Password</label>
                <input type="password" className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-[#f8f9fa] dark:bg-white/5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#d1d5db]" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-[12px] text-[#9ca3af] mb-1.5">New Password</label>
                <input type="password" className="w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-white/10 bg-[#f8f9fa] dark:bg-white/5 text-[13px] text-[#111827] dark:text-white focus:outline-none focus:border-[#d1d5db]" placeholder="••••••••" />
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a] text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity">
                <Save className="w-4 h-4" /> Update Password
              </button>
            </div>
            <div className="p-6 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <h3 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-3">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-[#6b7280] dark:text-[#a3a3a3]">Add an extra layer of security to your account.</p>
                  <p className="text-[11px] text-[#9ca3af] mt-1">Status: Not enabled</p>
                </div>
                <button className="px-4 py-2 rounded-lg border border-[#e5e7eb] dark:border-white/10 text-[13px] text-[#111827] dark:text-white font-medium hover:bg-[#f3f4f6] dark:hover:bg-white/5 transition-colors">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
