import { ReactNode } from 'react';
import { requireSession } from '@/lib/auth-guards';

export default async function CheckoutLayout({ children }: { children: ReactNode }) {
  await requireSession('/checkout');

  return children;
}
