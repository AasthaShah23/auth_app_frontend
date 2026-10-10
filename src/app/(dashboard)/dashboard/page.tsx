"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/presentation/store/auth.store";
import { CheckCircle2, ShieldCheck, Calendar, UserCheck } from "lucide-react";

function formatMemberDate(dateString?: string): string {
  if (!dateString) return "Oct 06, 2026";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Oct 06, 2026";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Oct 06, 2026";
  }
}

export default function DashboardPage() {
  const { user, profile, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const name = profile?.name || user?.fullName || user?.name || "User";
  const status = (profile?.isActive ?? user) ? "Active" : "Inactive";
  const memberSince = formatMemberDate(profile?.createdAt || user?.createdAt);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Greeting Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Welcome back, {name} 👋
        </h1>
      </div>

      {/* Account Details Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
        {/* Account Status Card */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-sm font-medium">Account Status</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xl font-bold text-zinc-900">{status}</span>
          </div>
        </div>

        {/* Member Since Card */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-sm font-medium">Member Since</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-zinc-900">{memberSince}</div>
        </div>
      </div>
    </div>
  );
}
