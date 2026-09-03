'use client';

import { ReactNode, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AppShellProps {
  children: ReactNode;
  title?: string;
}

export default function AppShell({ children, title }: AppShellProps) {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
