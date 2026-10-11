import React, { Suspense } from "react";
import { VerifyEmailView } from "@/presentation/components/auth/verify-email-view";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Verify Email - Clean Architecture Next.js",
  description: "Verify your email address to access your account",
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="mt-2 text-xs text-zinc-500">
            Loading verification session...
          </p>
        </div>
      }
    >
      <VerifyEmailView />
    </Suspense>
  );
}
