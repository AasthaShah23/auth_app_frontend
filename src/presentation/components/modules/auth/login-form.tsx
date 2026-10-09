"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/shared/validators/auth.validator";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onTouched",
  });

  async function onSubmit(data: LoginFormValues) {
    setServerError(null);
    try {
      // Simulated authentication call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (data.email === "test@error.com") {
        throw new Error("Invalid email or password");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Authentication failed. Please try again.");
      }
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
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {/* Back ambient halo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-200/60 via-purple-200/40 to-blue-200/50 blur-md scale-110" />
            
            {/* Avatar Circle */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100/90 backdrop-blur-md flex items-center justify-center shadow-inner overflow-hidden">
              <svg
                className="w-14 h-14 sm:w-16 sm:h-16 text-indigo-400/80 drop-shadow-sm"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Server status banner */}
        {serverError && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600 text-center animate-in fade-in">
            {serverError}
          </div>
        )}

        {isSuccess && (
          <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700 text-center animate-in fade-in">
            Login successful! Redirecting...
          </div>
        )}

        {/* Login Form */}
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
                disabled={isSubmitting || isSuccess}
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

          {/* Password Input Field */}
          <div className="space-y-1">
            <div className="relative flex items-center border-b border-zinc-300 focus-within:border-indigo-600 transition-colors pb-2">
              <Lock className="w-4 h-4 text-zinc-400 mr-3 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                disabled={isSubmitting || isSuccess}
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

          {/* Remember me & Forgot Password Row */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label
              className="flex items-center gap-2 text-zinc-600 cursor-pointer select-none group"
              suppressHydrationWarning
            >
              <input
                type="checkbox"
                suppressHydrationWarning
                {...register("rememberMe")}
                className="w-3.5 h-3.5 rounded bg-zinc-50 border-zinc-300 checked:bg-indigo-600 checked:border-indigo-600 focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer accent-indigo-600"
              />
              <span className="group-hover:text-zinc-900 transition-colors font-medium">
                Remember me
              </span>
            </label>

            <Link
              href="#"
              className="text-indigo-600 hover:text-indigo-800 italic font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Gradient Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              suppressHydrationWarning
              className="w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-semibold tracking-wider text-white uppercase bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>LOGIN</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
