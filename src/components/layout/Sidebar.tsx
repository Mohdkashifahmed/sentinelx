'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Plus, History, Shield, FileText, Bot, Globe, Bell, Settings, ChevronLeft, ChevronRight,
  Search, Users, Activity, ClipboardList, Eye, AlertTriangle, BarChart3, ShieldCheck, Wrench,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const userNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'New Scan', href: '/new-scan', icon: Plus },
  { label: 'Scan History', href: '/scans', icon: History },
  { label: 'Security Posture', href: '/posture', icon: Shield },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'AI Security Advisor', href: '/ai-advisor', icon: Bot },
  { label: 'Threat Intelligence', href: '/threat-intel', icon: Globe },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

const analystNav = [
  { label: 'Dashboard', href: '/analyst/dashboard', icon: LayoutDashboard },
  { label: 'Investigations', href: '/analyst/investigations', icon: Search },
  { label: 'Scans', href: '/analyst/scans', icon: Activity },
  { label: 'Threat Intel', href: '/analyst/threat-intel', icon: Globe },
  { label: 'Reports', href: '/analyst/reports', icon: FileText },
  { label: 'AI Analysis', href: '/analyst/ai-analysis', icon: Bot },
  { label: 'Audit Logs', href: '/analyst/audit-logs', icon: ClipboardList },
];

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Analysts', href: '/admin/analysts', icon: ShieldCheck },
  { label: 'Scans', href: '/admin/scans', icon: Activity },
  { label: 'Threats', href: '/admin/threats', icon: AlertTriangle },
  { label: 'Reports', href: '/admin/reports', icon: FileText },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList },
  { label: 'System Health', href: '/admin/system', icon: Wrench },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'analyst' ? analystNav : userNav;

  return (
    <aside className={cn(
      'h-screen flex flex-col bg-white dark:bg-[#0a0a0a] border-r border-[#e5e7eb] dark:border-white/5 transition-all duration-200',
      collapsed ? 'w-[60px]' : 'w-[240px]'
    )}>
      {/* Logo */}
      <div className={cn('h-14 flex items-center border-b border-[#e5e7eb] dark:border-white/5', collapsed ? 'justify-center px-2' : 'px-5')}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#111827] dark:bg-white flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-white dark:text-[#0a0a0a]" />
          </div>
          {!collapsed && <span className="text-[13px] font-semibold tracking-tight text-[#111827] dark:text-white">SENTINELX</span>}
        </div>
      </div>

      {/* Role Badge */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-[#e5e7eb] dark:border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#111827] dark:bg-white/10 flex items-center justify-center">
              <span className="text-[10px] font-medium text-white dark:text-white">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-[#111827] dark:text-white truncate">{user.name}</p>
              <p className="text-[10px] text-[#9ca3af] uppercase">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-colors',
                  collapsed ? 'justify-center' : '',
                  isActive
                    ? 'bg-[#111827] dark:bg-white/10 text-white dark:text-white font-medium'
                    : 'text-[#6b7280] dark:text-[#a3a3a3] hover:text-[#111827] dark:hover:text-white hover:bg-[#f3f4f6] dark:hover:bg-white/5'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-[#e5e7eb] dark:border-white/5 p-2">
        {!collapsed && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-[#6b7280] dark:text-[#a3a3a3] hover:text-[#111827] dark:hover:text-white hover:bg-[#f3f4f6] dark:hover:bg-white/5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span>Sign Out</span>
          </button>
        )}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 rounded-lg text-[#9ca3af] hover:text-[#6b7280] hover:bg-[#f3f4f6] dark:hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
