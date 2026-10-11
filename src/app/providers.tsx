'use client';

import React from 'react';
import { Toaster } from '@/components/ui/sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
};

