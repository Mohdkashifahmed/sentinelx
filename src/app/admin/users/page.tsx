'use client';
import StubPage from '@/components/layout/StubPage';
import { Users } from 'lucide-react';
export default function Page() {
  return <StubPage title="User Management" description="Manage platform users and their roles" redirectLabel="Go to Dashboard" redirectHref="/admin/dashboard" icon={Users} />;
}
