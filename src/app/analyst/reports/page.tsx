'use client';
import StubPage from '@/components/layout/StubPage';
import { FileText } from 'lucide-react';
export default function Page() {
  return <StubPage title="Reports" description="View your scan reports and download PDFs" redirectLabel="Go to Dashboard" redirectHref="/analyst/dashboard" icon={FileText} />;
}
