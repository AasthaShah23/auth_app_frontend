import { UserList } from "@/components/modules/users/UserList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Layers, ShieldCheck, Zap, Box } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="text-center py-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Zap className="h-3.5 w-3.5" /> Next.js App Router + TypeScript + Shadcn UI
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-zinc-900 dark:text-zinc-50">
          Clean Architecture Next.js Setup
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
          Built with React Hook Form, Zod validation, Shadcn/ui design system, and structured layers for production-ready fullstack development.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Button asChild size="lg">
            <Link href="/login">
              Explore Login Page <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="space-y-1">
            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
              <Layers className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">Clean Architecture</CardTitle>
            <CardDescription className="text-xs">
              Modular separation of concerns across Domain, Infrastructure, and Presentation.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
              <Box className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">Shadcn UI</CardTitle>
            <CardDescription className="text-xs">
              Accessible, customizable UI components powered by Radix UI and Tailwind CSS.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">React Hook Form + Zod</CardTitle>
            <CardDescription className="text-xs">
              Type-safe schema validation and performant uncontrolled form state management.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
              <Zap className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">App Router</CardTitle>
            <CardDescription className="text-xs">
              Next.js route groups `(auth)` & `(dashboard)` with parallel layout support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* User Management Demo */}
      <div className="pt-4">
        <UserList />
      </div>
    </div>
  );
}
