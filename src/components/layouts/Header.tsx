import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
            Clean Architecture
          </Link>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono border border-blue-200 dark:border-blue-800">
            Next.js App Router
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/users"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Users
          </Link>
          <Button asChild size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

