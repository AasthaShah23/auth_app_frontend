import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layouts/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900">
      {/* Header only shown on authenticated dashboard routes */}
      <Header />
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shrink-0 shadow-sm">
          <div className="space-y-4">
            <div className="px-3 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Dashboard Menu
            </div>
            <nav className="flex md:flex-col gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/users"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                👥 Users Management
              </Link>
            </nav>
          </div>

          <div className="mt-4 md:mt-0 p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs text-zinc-500">
            Route Group: <span className="font-mono text-indigo-600">(dashboard)</span>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <section className="flex-1 min-w-0">
          {children}
        </section>
      </div>
    </div>
  );
}
