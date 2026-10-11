"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/presentation/store/auth.store";
import { Button } from "@/components/ui/button";
import {
  Mail,
  ShieldAlert,
  Loader2,
  RotateCw,
  CheckCircle2,
  Send,
} from "lucide-react";
import { toast } from "sonner";

function formatFullDate(dateString?: string): string {
  if (!dateString) return "October 6, 2026";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "October 6, 2026";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "October 6, 2026";
  }
}

export default function ProfilePage() {
  const {
    user,
    profile,
    fetchProfile,
    resendVerificationEmail,
  } = useAuthStore();
  const isEmailVerified = profile ? profile.is_email_verified : true;

  const [isResending, setIsResending] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const message = await resendVerificationEmail(email);
      toast.success("Verification Link Sent", {
        description:
          message || "Please check your email inbox for instructions.",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send verification link.";
      toast.error("Failed to Send", {
        description: message,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsCheckingStatus(true);
    try {
      const updated = await fetchProfile();
      if (updated && updated.is_email_verified !== false) {
        toast.success("Email Verified!", {
          description: "Your email address has been verified successfully.",
        });
      } else {
        toast.info("Status Checked", {
          description:
            "Email is still awaiting verification. Please check your inbox.",
        });
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const name = profile?.name || "User";
  const email = profile?.email || user?.email;
  const accountCreated = formatFullDate(profile?.created_at);
  const accountStatus =
    isEmailVerified && profile?.is_active ? "Active" : "Inactive";

  const messageText =
    "Please verify your email address to view profile details.";

  return (
    <div className="max-w-xl mx-auto py-8">
      {/* Relative container holding profile card and optional blurred overlay */}
      <div className="relative">
        {/* Profile Card Container (blurred when not verified) */}
        <div
          className={`bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-300 ${
            !isEmailVerified
              ? "filter blur-md pointer-events-none select-none opacity-40 scale-[0.99]"
              : ""
          }`}
        >
          {/* Card Header */}
          <div className="border-b border-zinc-100 px-8 py-5 text-center bg-zinc-50/50">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              My Profile
            </h1>
          </div>

          {/* Card Body */}
          <div className="px-8 py-6 space-y-6">
            {/* Name Field */}
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Name
              </div>
              <div className="text-base font-medium text-zinc-900 flex items-center gap-2">
                <span>{name}</span>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Email
              </div>
              <div className="text-base font-medium text-zinc-900 flex items-center gap-2">
                <span>{email}</span>
              </div>
            </div>

            {/* Account Created Field */}
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Account Created
              </div>
              <div className="text-base font-medium text-zinc-900 flex items-center gap-2">
                <span>{accountCreated}</span>
              </div>
            </div>

            {/* Account Status Field */}
            <div>
              <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Account Status
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    accountStatus === "Active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      accountStatus === "Active"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-amber-500"
                    }`}
                  />
                  {accountStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Email Verification Required Overlay (shown when unverified) */}
        {!isEmailVerified && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-20">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-zinc-200/90 rounded-3xl p-7 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)] text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
              {/* Alert Badge Icon */}
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4 shadow-inner">
                <ShieldAlert className="w-8 h-8" />
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                Email Verification Required
              </h2>

              {/* Message from backend */}
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 max-w-xs leading-relaxed">
                {messageText}
              </p>

              {/* Email badge */}
              <div className="mt-3 px-3 py-1 bg-zinc-100 rounded-full text-[11px] font-medium text-zinc-600 flex items-center gap-1.5 border border-zinc-200/70">
                <Mail className="w-3 h-3 text-zinc-400" />
                <span className="truncate max-w-[200px]">{email}</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-2.5 w-full">
                <Button
                  onClick={handleResend}
                  disabled={isResending}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm h-10 rounded-xl"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-2" />
                      Resend Verification Link
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCheckVerification}
                  disabled={isCheckingStatus}
                  className="border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs h-10 rounded-xl px-3"
                  title="Check if verified"
                >
                  <RotateCw
                    className={`w-3.5 h-3.5 ${
                      isCheckingStatus ? "animate-spin" : ""
                    }`}
                  />
                  <span className="sm:hidden ml-1.5">Check Status</span>
                </Button>
              </div>

              <p className="text-[11px] text-zinc-400 mt-4">
                Did you already verify? Click the check button above to refresh
                your status.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
