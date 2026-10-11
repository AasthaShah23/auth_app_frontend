"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/shared/validators/auth.validator";
import { container } from "@/infrastructure/di/container";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) {
      toast.error("Invalid Reset Link", {
        description: "Password reset token is missing from the URL.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await container.resetPasswordUseCase.execute({
        token,
        newPassword: data.password,
      });

      reset();

      toast.success("Password Reset Successful", {
        description: response.message || "You can now sign in with your new password.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 700);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to reset password. Please try again.";
      toast.error("Reset Failed", {
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
              <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400/90 drop-shadow-sm" />
            </div>
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-zinc-900 text-center">
            Reset Password
          </h2>
          <p className="mt-1 text-xs text-zinc-500 text-center max-w-[280px]">
            Please enter and confirm your new password.
          </p>
        </div>

        {/* Missing Token Warning */}
        {!token && (
          <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 flex items-start gap-2.5 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Reset token missing</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                The reset link seems invalid or incomplete. Please request a new password reset link.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block mt-2 font-semibold text-indigo-600 hover:underline"
              >
                Request new link ➔
              </Link>
            </div>
          </div>
        )}

        {/* Reset Password Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          suppressHydrationWarning
        >
          {/* New Password Input Field */}
          <div className="space-y-1">
            <div className="relative flex items-center border-b border-zinc-300 focus-within:border-indigo-600 transition-colors pb-2">
              <Lock className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                autoComplete="new-password"
                disabled={isLoading || !token}
                suppressHydrationWarning
                {...register("password")}
                className="w-full bg-transparent border-0 p-0 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 disabled:opacity-50 pr-7"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                suppressHydrationWarning
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 font-medium pt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm New Password Input Field */}
          <div className="space-y-1">
            <div className="relative flex items-center border-b border-zinc-300 focus-within:border-indigo-600 transition-colors pb-2">
              <Lock className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                autoComplete="new-password"
                disabled={isLoading || !token}
                suppressHydrationWarning
                {...register("confirmPassword")}
                className="w-full bg-transparent border-0 p-0 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 disabled:opacity-50 pr-7"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-0 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                suppressHydrationWarning
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-500 font-medium pt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Reset Password Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !token}
              suppressHydrationWarning
              className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-semibold tracking-wider text-white uppercase bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <span>RESET PASSWORD</span>
              )}
            </button>
          </div>
        </form>

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

