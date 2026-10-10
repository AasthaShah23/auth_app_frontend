import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Activity, CheckCircle2, Shield } from "lucide-react";
import { DashboardWelcome } from "@/presentation/components/modules/dashboard/dashboard-welcome";

export const metadata = {
  title: "Dashboard - Clean Architecture Next.js",
  description: "Main Dashboard overview",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Dynamic Welcome card with user details from Zustand */}
      <DashboardWelcome />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-zinc-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <p className="text-xs text-zinc-500 mt-1">Real-time active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              99.9%
            </div>
            <p className="text-xs text-zinc-500 mt-1">All services operational</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session & Security Architecture</CardTitle>
          <CardDescription>
            httpOnly Cookie JWT Storage + Zustand Global State Management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            • <strong>Secure JWT Storage:</strong> Authentication tokens are stored inside secure, HTTP-only, SameSite=Lax cookies, completely inaccessible to client-side XSS attacks.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            • <strong>Global State:</strong> User details, profile information, and authentication statuses are managed globally in <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-600">Zustand (useAuthStore)</code> for instant reactive UI updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
