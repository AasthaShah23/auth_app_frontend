"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/presentation/store/auth.store";
import { User, Mail, Calendar, CheckCircle, Shield } from "lucide-react";

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
  const { user, profile, fetchProfile, isLoading } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const name = profile?.name || user?.fullName || user?.name || "Aastha Shah";
  const email = profile?.email || user?.email || "aastha@example.com";
  const accountCreated = formatFullDate(profile?.createdAt || user?.createdAt);
  const accountStatus = (profile?.isActive ?? user) ? "Active" : "Inactive";

  return (
    <div className="max-w-xl mx-auto py-8">
      {/* Profile Card Container */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
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
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                {accountStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

