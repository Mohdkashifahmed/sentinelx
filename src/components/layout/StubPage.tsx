'use client';

import AppShell from '@/components/layout/AppShell';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface StubPageProps {
  title: string;
  description: string;
  redirectLabel: string;
  redirectHref: string;
  icon: React.ElementType;
}

export default function StubPage({ title, description, redirectLabel, redirectHref, icon: Icon }: StubPageProps) {
  return (
    <AppShell title={title}>
      <div className="max-w-[800px] mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#f3f4f6] dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
            <Icon className="w-8 h-8 text-[#9ca3af]" />
          </div>
          <h2 className="text-[18px] font-semibold text-[#111827] dark:text-white mb-2">{title}</h2>
          <p className="text-[13px] text-[#9ca3af] mb-6 max-w-[400px] mx-auto">{description}</p>
          <Link href={redirectHref} className="inline-flex items-center gap-2 px-4 py-2 bg-[#111827] dark:bg-white text-white dark:text-[#0a0a0a] text-[13px] font-medium rounded-lg hover:opacity-90 transition-opacity">
            {redirectLabel} <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
