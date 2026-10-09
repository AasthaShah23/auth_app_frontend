import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Activity, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Dashboard - Clean Architecture Next.js",
  description: "Main Dashboard overview",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>

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
          <CardTitle>Architecture Information</CardTitle>
          <CardDescription>
            Next.js App Router with Shadcn UI & Clean Architecture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            This dashboard is rendered inside the <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-blue-600">src/app/(dashboard)/dashboard/page.tsx</code> route group, inheriting the dashboard sidebar navigation layout.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
