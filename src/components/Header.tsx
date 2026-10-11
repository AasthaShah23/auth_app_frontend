"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/presentation/store/auth.store";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, profile, isAuthenticated, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to connect to backend for logout.";
      toast.error("Logout Failed", {
        description: message,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="w-full border-b border-zinc-200 bg-white/90 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-bold text-xl tracking-tight bg-gradient-to-r bg-clip-text text-black"
          >
            AuthApp
          </Link>
        </div>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/dashboard"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Profile
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-3 pl-2 border-l border-zinc-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-zinc-200"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </>
                )}
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
