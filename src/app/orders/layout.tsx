import { ReactNode } from 'react';
import { requireSession } from '@/lib/auth-guards';

export default async function OrdersLayout({ children }: { children: ReactNode }) {
  await requireSession('/orders');

  return children;
}
