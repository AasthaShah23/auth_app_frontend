"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/presentation/store/auth.store";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  MailCheck,
  ArrowRight,
  Send,
  Home,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";

export function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const { verifyEmail, resendVerificationEmail, user, token: authToken } = useAuthStore();
  const isAuthenticated = Boolean(user || authToken);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "No verification token found in the URL. Please verify your link."
  );
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    let isMounted = true;

    async function handleVerify() {
      try {
        const msg = await verifyEmail(token);
        if (isMounted) {
          setStatus("success");
          toast.success("Email Verified", {
            description: msg || "Your email address has been verified successfully.",
          });
        }
      } catch (err: unknown) {
        if (isMounted) {
          setStatus("error");
          const msg =
            err instanceof Error
              ? err.message
              : "Verification token is invalid or has expired (24-hour limit).";
          setErrorMessage(msg);
          toast.error("Verification Failed", {
            description: msg,
          });
        }
      }
    }

    handleVerify();

    return () => {
      isMounted = false;
    };
  }, [token, verifyEmail]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const emailToSend = user?.email || "";
      const msg = await resendVerificationEmail(emailToSend);
      toast.success("Verification Link Sent", {
        description: msg || "Please check your inbox for the new verification link.",
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to resend verification email.";
      toast.error("Resend Failed", { description: msg });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      {/* Ambient background glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-300/30 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-48 h-48 bg-indigo-300/30 rounded-full blur-[70px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative bg-white/90 backdrop-blur-xl border border-zinc-200/80 rounded-[36px] px-8 py-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] text-center flex flex-col items-center">
        {/* Loading State */}
        {status === "loading" && (
          <div className="space-y-4 py-4">
            <div className="w-20 h-20 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto shadow-inner">
              <Loader2 className="w-9 h-9 text-indigo-600 animate-spin" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Verifying Email
            </h2>
            <p className="text-xs text-zinc-500 max-w-[280px]">
              Please wait while we validate your verification token with our server...
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="space-y-4 py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                Email Verified Successfully!
              </h2>
              <p className="text-xs text-zinc-500 mt-2 max-w-[300px]">
                Your email address has been verified. You now have full access to your profile and all dashboard features.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-2.5 w-full">
              {isAuthenticated ? (
                <Button
                  asChild
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 text-xs font-semibold shadow-sm"
                >
                  <Link href="/profile">
                    <span>Go to Profile</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 text-xs font-semibold shadow-sm"
                >
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-1.5" />
                    <span>Proceed to Login</span>
                  </Link>
                </Button>
              )}

              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl h-10 text-xs border-zinc-200"
              >
                <Link href="/dashboard">
                  <Home className="w-3.5 h-3.5 mr-1.5" />
                  <span>Go to Dashboard</span>
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Error / Expired State */}
        {status === "error" && (
          <div className="space-y-4 py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600 shadow-inner">
              <XCircle className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                Verification Failed
              </h2>
              <p className="text-xs text-rose-600 font-medium mt-2 max-w-[300px]">
                {errorMessage}
              </p>
              <p className="text-[11px] text-zinc-400 mt-1 max-w-[280px]">
                Verification tokens expire after 24 hours and can only be used once.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-2.5 w-full">
              <Button
                onClick={handleResend}
                disabled={isResending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 text-xs font-semibold shadow-sm"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Sending new link...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Resend Verification Link
                  </>
                )}
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full rounded-xl h-10 text-xs border-zinc-200"
              >
                <Link href="/login">
                  <LogIn className="w-3.5 h-3.5 mr-1.5" />
                  <span>Back to Login</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

