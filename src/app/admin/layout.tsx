import { ReactNode } from 'react';
import { requireAdminSession } from '@/lib/auth-guards';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminSession('/admin');

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
