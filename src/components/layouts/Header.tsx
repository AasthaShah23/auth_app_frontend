"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/presentation/store/auth.store";
import { LogOut, Loader2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export const Header: React.FC = () => {
  const router = useRouter();
  // Extract user details and authentication state directly from Zustand global store
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = user?.name || user?.email || "User";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect to backend for logout.";
      toast.error("Logout Failed", {
        description: message,
      });
      // Do NOT redirect or clear local state on error
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
            className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
          >
            Tong Garden Assessment
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
            href="/users"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Users
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-zinc-200">
              {/* User badge showing details taken directly from Zustand */}
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200/80 text-xs font-medium text-zinc-700">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate" title={displayName}>
                  {displayName}
                </span>
              </div>

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
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
