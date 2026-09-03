'use client';
import StubPage from '@/components/layout/StubPage';
import { Bot } from 'lucide-react';
export default function Page() {
  return <StubPage title="AI Analysis" description="Review AI-generated analysis across scans" redirectLabel="Go to Dashboard" redirectHref="/analyst/dashboard" icon={Bot} />;
}
