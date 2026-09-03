'use client';
import StubPage from '@/components/layout/StubPage';
import { Settings } from 'lucide-react';
export default function Page() {
  return <StubPage title="Platform Settings" description="Configure system and scanner settings" redirectLabel="Go to Dashboard" redirectHref="/admin/dashboard" icon={Settings} />;
}
