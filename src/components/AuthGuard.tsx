"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/presentation/store/auth.store";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);
  const isCheckingRef = React.useRef(false);

  useEffect(() => {
    let active = true;

    async function init() {
      if (isAuthenticated) {
        setHasChecked(true);
        return;
      }

      if (isCheckingRef.current) {
        return;
      }
      isCheckingRef.current = true;

      const authed = await checkAuth();
      if (active) {
        setHasChecked(true);
        if (!authed) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      }
    }

    init();

    return () => {
      active = false;
    };
  }, [isAuthenticated, checkAuth, pathname, router]);

  // Keep a loading state while checking the session to prevent premature redirects to the login page
  if (isLoading || !hasChecked) {
    return (
      <div className="min-h-[70vh] w-full flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium text-zinc-500">Checking session...</p>
      </div>
    );
  }

  // Authenticated
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // Not authenticated and redirect is in progress
  return null;
};
