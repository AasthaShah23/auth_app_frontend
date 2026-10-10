"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/presentation/store/auth.store";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, initSession } = useAuthStore();

  useEffect(() => {
    // If store not initialized yet, verify session from httpOnly cookies
    if (!isInitialized) {
      initSession();
    }
  }, [isInitialized, initSession]);

  useEffect(() => {
    if (!isInitialized) return;

    // If session verification is complete and user is not authenticated
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isInitialized, isAuthenticated, pathname, router]);

  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="min-h-[70vh] w-full flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium text-zinc-500">Verifying authentication session...</p>
      </div>
    );
  }

  return <>{children}</>;
};
