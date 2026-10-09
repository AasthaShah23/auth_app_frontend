"use client";

import React from "react";
import { useAuthStore } from "@/presentation/store/auth.store";
import { Sparkles, ShieldCheck, Mail, User as UserIcon } from "lucide-react";

export function DashboardWelcome() {
  const { user } = useAuthStore();

  const name = user?.fullName || user?.name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "user@example.com";
  const role = user?.role || "Member";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-6 text-white shadow-lg">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Welcome Back</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Hello, {name}!
          </h2>
          <p className="text-sm text-indigo-100 mt-1">
            Logged in via secure httpOnly JWT session & Zustand global store.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-indigo-200" />
            <span className="font-medium">{email}</span>
          </div>
          <div className="h-3.5 w-px bg-white/30" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold uppercase tracking-wider text-[11px] bg-emerald-500/30 px-2 py-0.5 rounded-full border border-emerald-400/30">
              {role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

