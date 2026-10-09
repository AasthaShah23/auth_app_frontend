import React from "react";
import { Header } from "@/components/layouts/Header";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900">
        {/* Header only shown on authenticated dashboard routes */}
        <Header />

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
          {/* Main Dashboard Content */}
          <section className="flex-1 min-w-0">{children}</section>
        </div>
      </div>
    </AuthGuard>
  );
}
