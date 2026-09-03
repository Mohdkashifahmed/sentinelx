'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { demoNotifications } from '@/data/notifications';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const unread = demoNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <header className="h-14 flex items-center justify-between px-6 border-b border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
        <h1 className="text-[15px] font-semibold text-[#111827] dark:text-white">{title || 'Dashboard'}</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e5e7eb] dark:border-white/10 text-[12px] text-[#9ca3af] hover:border-[#d1d5db] dark:hover:border-white/20 transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-[#f3f4f6] dark:bg-white/5 border border-[#e5e7eb] dark:border-white/10">⌘K</kbd>
          </button>
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg text-[#6b7280] hover:text-[#111827] dark:hover:text-white hover:bg-[#f3f4f6] dark:hover:bg-white/5 transition-colors">
              <Bell className="w-4 h-4" />
              {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-medium text-white flex items-center justify-center">{unread}</span>}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-[360px] bg-white dark:bg-[#111111] border border-[#e5e7eb] dark:border-white/10 rounded-xl shadow-lg z-50 animate-slide-up">
                <div className="px-4 py-3 border-b border-[#e5e7eb] dark:border-white/5 flex items-center justify-between">
                  <span className="text-[13px] font-medium text-[#111827] dark:text-white">Notifications</span>
                  <Link href="/notifications" onClick={() => setNotifOpen(false)} className="text-[12px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white">View All</Link>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {demoNotifications.slice(0, 5).map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-[#f3f4f6] dark:border-white/5 ${!n.read ? 'bg-[#f8f9fa] dark:bg-white/[0.02]' : ''}`}>
                      <p className="text-[12px] font-medium text-[#111827] dark:text-white">{n.title}</p>
                      <p className="text-[11px] text-[#6b7280] mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-[#9ca3af] mt-1">{formatDateTime(n.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} />
          <div className="relative w-full max-w-[560px] mx-4 bg-white dark:bg-[#111111] border border-[#e5e7eb] dark:border-white/10 rounded-xl shadow-2xl animate-slide-up">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e5e7eb] dark:border-white/5">
              <Search className="w-4 h-4 text-[#9ca3af]" />
              <input ref={searchRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[14px] text-[#111827] dark:text-white placeholder:text-[#9ca3af] focus:outline-none" placeholder="Search scans, targets, reports..." />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="p-1 rounded hover:bg-[#f3f4f6] dark:hover:bg-white/5"><X className="w-4 h-4 text-[#9ca3af]" /></button>
            </div>
            <div className="p-3 text-center"><p className="text-[12px] text-[#9ca3af]">Type to search across scans, targets, and reports</p></div>
          </div>
        </div>
      )}
    </>
  );
}
