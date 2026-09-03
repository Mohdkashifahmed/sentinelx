'use client';
import StubPage from '@/components/layout/StubPage';
import { ShieldCheck } from 'lucide-react';
export default function Page() {
  return <StubPage title="Analyst Management" description="Manage security analysts and assignments" redirectLabel="Go to Dashboard" redirectHref="/admin/dashboard" icon={ShieldCheck} />;
}
