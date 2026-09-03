'use client';
import StubPage from '@/components/layout/StubPage';
import { ClipboardList } from 'lucide-react';
export default function Page() {
  return <StubPage title="Audit Logs" description="Complete system activity audit trail" redirectLabel="Go to Dashboard" redirectHref="/admin/dashboard" icon={ClipboardList} />;
}
