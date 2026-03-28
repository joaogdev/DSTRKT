import { ReactNode } from 'react';
import { requireSession } from '@/lib/auth-guards';

export default async function AccountLayout({ children }: { children: ReactNode }) {
  await requireSession('/account');

  return children;
}
