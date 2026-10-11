"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import {
  signupSchema,
  type SignupFormValues,
} from "@/shared/validators/auth.validator";
import { useAuthStore } from "@/presentation/store/auth.store";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const { signup, isAuthenticated, isLoading: authLoading } = useAuthStore();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    mode: "onTouched",
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    try {
      const session = await signup({
        name: data.fullName,
        email: data.email,
        password: data.password,
      });

      // Clear the form fields on success
      reset();

      // Show success toast notification
      toast.success("Account Created", {
        description:
          session?.message ||
          "Registration successful. A verification link has been sent to your email address.",
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      // Show error toast notification
      toast.error("Sign Up Failed", {
        description: message,
        className: "whitespace-pre-line",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative w-full max-w-[400px] mx-auto">
      {/* Ambient background glow spots */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-300/30 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-48 h-48 bg-blue-300/30 rounded-full blur-[70px] pointer-events-none" />
      <div className="absolute -bottom-10 left-0 w-44 h-44 bg-indigo-300/25 rounded-full blur-[70px] pointer-events-none" />

      {/* Main White Glassmorphic Card */}
      <div className="relative bg-white/85 backdrop-blur-xl border border-zinc-200/80 rounded-[36px] px-7 py-8 sm:px-9 sm:py-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all">
        {/* Top Avatar with soft ambient halo */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {/* Back ambient halo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-200/60 via-purple-200/40 to-blue-200/50 blur-md scale-110" />

            {/* Avatar Circle */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100/90 backdrop-blur-md flex items-center justify-center shadow-inner overflow-hidden">
              <UserPlus className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400/90 drop-shadow-sm" />
            </div>
          </div>
          <h2 className="mt-3 text-lg font-bold tracking-tight text-zinc-900">
            Create Account
          </h2>
          <p className="text-xs text-zinc-500">Sign up to get started</p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          suppressHydrationWarning
        >
          {/* Full Name Field */}
          <div className="space-y-1">
            <div className="relative flex items-center border-b border-zinc-300 focus-within:border-indigo-600 transition-colors pb-2">
              <User className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                disabled={isLoading}
                suppressHydrationWarning
                {...register("fullName")}
                className="w-full bg-transparent border-0 p-0 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 disabled:opacity-50"
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-red-500 font-medium pt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <div className="relative flex items-center border-b border-zinc-300 focus-within:border-indigo-600 transition-colors pb-2">
              <Mail className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
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

          {/* Password Field */}
          <div className="space-y-1">
            <div className="relative flex items-center border-b border-zinc-300 focus-within:border-indigo-600 transition-colors pb-2">
              <Lock className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                disabled={isLoading}
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

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <div className="relative flex items-center border-b border-zinc-300 focus-within:border-indigo-600 transition-colors pb-2">
              <Lock className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                autoComplete="new-password"
                disabled={isLoading}
                suppressHydrationWarning
                {...register("confirmPassword")}
                className="w-full bg-transparent border-0 p-0 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 disabled:opacity-50 pr-7"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-0 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none"
                tabIndex={-1}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
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

          {/* Terms & Conditions Checkbox */}
          <div className="pt-1">
            <label
              className="flex items-start gap-2 text-zinc-600 cursor-pointer select-none group"
              suppressHydrationWarning
            >
              <input
                type="checkbox"
                suppressHydrationWarning
                {...register("terms")}
                className="w-3.5 h-3.5 mt-0.5 rounded bg-zinc-50 border-zinc-300 checked:bg-indigo-600 checked:border-indigo-600 focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer accent-indigo-600"
              />
              <span className="text-xs group-hover:text-zinc-900 transition-colors">
                I agree to the{" "}
                <Link href="#" className="text-indigo-600 hover:underline">
                  Terms & Conditions
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-[11px] text-red-500 font-medium pt-1">
                {errors.terms.message}
              </p>
            )}
          </div>

          {/* Sign Up Button */}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>SIGN UP</span>
              )}
            </button>
          </div>
        </form>

        {/* Footer: Link to Login */}
        <div className="mt-6 pt-4 border-t border-zinc-200/60 text-center text-xs text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline ml-1"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
