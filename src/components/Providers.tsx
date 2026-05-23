'use client'

import { useEffect } from 'react';
import { SessionProvider } from "next-auth/react";
import { useProductStore } from '@/store/useProductStore';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useProductStore.getState().fetchProducts();
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
