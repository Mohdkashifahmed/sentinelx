'use client';
import StubPage from '@/components/layout/StubPage';
import { FileText } from 'lucide-react';
export default function Page() {
  return <StubPage title="Reports" description="View all generated security reports" redirectLabel="Go to Dashboard" redirectHref="/admin/dashboard" icon={FileText} />;
}
