'use client';
import StubPage from '@/components/layout/StubPage';
import { Activity } from 'lucide-react';
export default function Page() {
  return <StubPage title="All Scans" description="View all scans across the platform" redirectLabel="Go to Dashboard" redirectHref="/admin/dashboard" icon={Activity} />;
}
