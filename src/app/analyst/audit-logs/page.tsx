'use client';
import StubPage from '@/components/layout/StubPage';
import { ClipboardList } from 'lucide-react';
export default function Page() {
  return <StubPage title="Audit Logs" description="Track all system activities and changes" redirectLabel="Go to Dashboard" redirectHref="/analyst/dashboard" icon={ClipboardList} />;
}
