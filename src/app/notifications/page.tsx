'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { demoNotifications } from '@/data/notifications';
import { cn, formatDateTime } from '@/lib/utils';
import { Bell, CheckCircle2, AlertTriangle, FileText, MessageSquare, Settings, X } from 'lucide-react';

const typeIcons: Record<string, typeof Bell> = {
  scan_complete: CheckCircle2,
  high_risk: AlertTriangle,
  report_ready: FileText,
  analyst_review: MessageSquare,
  case_escalated: AlertTriangle,
  system: Settings,
};

const typeColors: Record<string, string> = {
  scan_complete: 'text-green-500 bg-green-50 dark:bg-green-950/30',
  high_risk: 'text-red-500 bg-red-50 dark:bg-red-950/30',
  report_ready: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30',
  analyst_review: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30',
  case_escalated: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30',
  system: 'text-gray-500 bg-gray-50 dark:bg-gray-950/30',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppShell title="Notifications">
      <div className="max-w-[800px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-semibold text-[#111827] dark:text-white">Notifications</h2>
            <p className="text-[13px] text-[#9ca3af] mt-0.5">{unreadCount} unread notifications</p>
          </div>
          <button onClick={markAllRead} className="text-[12px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white">
            Mark all as read
          </button>
        </div>

        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors', filter === f ? 'bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a]' : 'text-[#6b7280] hover:bg-[#f3f4f6] dark:hover:bg-white/5')}>
              {f === 'all' ? 'All' : 'Unread'}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            const colorClass = typeColors[n.type] || 'text-gray-500 bg-gray-50';
            return (
              <div key={n.id} className={cn('flex items-start gap-4 p-4 rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a] transition-colors', !n.read && 'bg-blue-50/30 dark:bg-blue-950/10 border-blue-100 dark:border-blue-800/20')}>
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', colorClass)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-[#111827] dark:text-white">{n.title}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-[12px] text-[#6b7280] dark:text-[#a3a3a3] mt-0.5">{n.message}</p>
                  <p className="text-[11px] text-[#9ca3af] mt-1">{formatDateTime(n.createdAt)}</p>
                </div>
                <button onClick={() => dismiss(n.id)} className="p-1 rounded hover:bg-[#f3f4f6] dark:hover:bg-white/5 text-[#9ca3af]">
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-12 text-center rounded-xl border border-[#e5e7eb] dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
              <Bell className="w-8 h-8 text-[#9ca3af] mx-auto mb-3" />
              <p className="text-[14px] text-[#9ca3af]">No notifications to display</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
