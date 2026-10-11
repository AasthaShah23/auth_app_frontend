"use client";

import React from "react";
import Link from "next/link";
import { ProfileDTO } from "@/infrastructure/dtos/profile.dto";
import { User } from "@/domain/entities/auth.entity";
import {
  UserCheck,
  Calendar,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface UserDashboardProps {
  user: User | null;
  profile: ProfileDTO | null;
  isEmailVerified?: boolean;
}

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

export function UserDashboard({
  user,
  profile,
  isEmailVerified = true,
}: UserDashboardProps) {
  const name = user?.name || "User";
  const isAccountActive = isEmailVerified && (profile?.is_active ?? true);
  const status = isAccountActive ? "Active" : "Inactive";
  const memberSince = formatMemberDate(profile?.created_at);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Unverified Email Warning Banner */}
      {!isEmailVerified && (
        <div className="max-w-xl bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-amber-800 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">
                Email Verification Required
              </p>
              <p className="text-amber-700 mt-0.5">
                Please verify your email address to view complete profile
                details.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="shrink-0 inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-xl border border-amber-200 hover:border-indigo-300 transition-colors shadow-2xs"
          >
            <span>Verify</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

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
            <UserCheck
              className={`w-4 h-4 ${isAccountActive ? "text-emerald-500" : "text-amber-500"}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                isAccountActive
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-amber-500"
              }`}
            />
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

      {/* Authentication Section */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm max-w-xl">
        <div className="flex items-center gap-2 text-zinc-900 font-semibold text-base mb-1">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>Authentication</span>
        </div>
        <p className="text-sm text-zinc-500">
          Your account is securely authenticated.
        </p>
      </div>
    </div>
  );
}
