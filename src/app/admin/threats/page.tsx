'use client';
import StubPage from '@/components/layout/StubPage';
import { AlertTriangle } from 'lucide-react';
export default function Page() {
  return <StubPage title="Threat Overview" description="Monitor active threats and indicators" redirectLabel="Go to Dashboard" redirectHref="/admin/dashboard" icon={AlertTriangle} />;
}
