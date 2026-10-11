"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/shared/validators/auth.validator";
import { container } from "@/infrastructure/di/container";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true);
    try {
      const response = await container.forgotPasswordUseCase.execute(data.email);

      reset();
      setIsEmailSent(true);

      toast.success("Reset Link Sent", {
        description: response.message || "Please check your inbox for instructions.",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset link. Please try again.";
      toast.error("Request Failed", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-[390px] mx-auto">
      {/* Soft ambient pastel background glow spots */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-300/30 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-48 h-48 bg-blue-300/30 rounded-full blur-[70px] pointer-events-none" />
      <div className="absolute -bottom-10 left-0 w-44 h-44 bg-indigo-300/25 rounded-full blur-[70px] pointer-events-none" />

      {/* Main White / Light Theme Glassmorphic Card */}
      <div className="relative bg-white/85 backdrop-blur-xl border border-zinc-200/80 rounded-[36px] px-7 py-9 sm:px-9 sm:py-11 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all">
        {/* Top Avatar with soft ambient halo */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {/* Back ambient halo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-200/60 via-purple-200/40 to-blue-200/50 blur-md scale-110" />

            {/* Avatar Circle */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100/90 backdrop-blur-md flex items-center justify-center shadow-inner overflow-hidden">
              <KeyRound className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400/90 drop-shadow-sm" />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-zinc-900 text-center">
            Forgot Password
          </h2>
          <p className="mt-1 text-xs text-zinc-500 text-center max-w-[280px]">
            {isEmailSent
              ? "We have sent a password reset link to your email address."
              : "Enter your registered email ID to receive a password reset link."}
          </p>
        </div>

        {/* Forgot Password Form */}
        {!isEmailSent ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            suppressHydrationWarning
          >
            {/* Email Input Field */}
            <div className="space-y-1">
              <div className="relative flex items-center border-b border-zinc-300 focus-within:border-indigo-600 transition-colors pb-2">
                <Mail className="w-4 h-4 text-zinc-400 mr-3 shrink-0 group-focus-within:text-indigo-600" />
                <input
                  type="email"
                  placeholder="Email ID"
                  autoComplete="email"
                  disabled={isLoading}
                  suppressHydrationWarning
                  {...register("email")}
                  className="w-full bg-transparent border-0 p-0 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 disabled:opacity-50"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 font-medium pt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Send Reset Link Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                suppressHydrationWarning
                className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-semibold tracking-wider text-white uppercase bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sending Link...</span>
                  </>
                ) : (
                  <span>SEND RESET LINK</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 pt-2">
            <button
              type="button"
              onClick={() => setIsEmailSent(false)}
              className="w-full py-3 px-6 rounded-2xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Send link again
            </button>
          </div>
        )}

        {/* Footer: Back to Login */}
        <div className="mt-6 pt-4 border-t border-zinc-200/60 text-center text-xs text-zinc-600">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

