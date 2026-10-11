"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/presentation/store/auth.store";
import { AdminDashboard } from "@/presentation/components/dashboard/admin-dashboard";
import { UserDashboard } from "@/presentation/components/dashboard/user-dashboard";

export default function DashboardPage() {
  const { user, profile } = useAuthStore();

  const isAdmin = (user?.role || profile?.role || "").toLowerCase() === "admin";
  const isEmailVerified = Boolean(profile?.is_email_verified);

  return isAdmin ? (
    <AdminDashboard />
  ) : (
    <UserDashboard
      user={user}
      profile={profile}
      isEmailVerified={isEmailVerified}
    />
  );
}
