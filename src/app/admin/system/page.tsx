'use client';
import StubPage from '@/components/layout/StubPage';
import { Wrench } from 'lucide-react';
export default function Page() {
  return <StubPage title="System Health" description="Monitor platform health and performance" redirectLabel="Go to Dashboard" redirectHref="/admin/dashboard" icon={Wrench} />;
}
