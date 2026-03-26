'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import StoreProvider from './StoreProvider';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <SessionProvider>{children}</SessionProvider>
    </StoreProvider>
  );
}