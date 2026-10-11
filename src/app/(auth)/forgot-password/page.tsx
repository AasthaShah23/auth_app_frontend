import { Metadata } from "next";
import { ForgotPasswordForm } from "@/presentation/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password - Account Recovery",
  description: "Request a password reset link",
};

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-slate-50 via-zinc-100 to-indigo-50/40 overflow-hidden">
      {/* Soft pastel ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[350px] sm:h-[450px] bg-gradient-to-b from-rose-200/40 via-purple-100/30 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[500px] bg-gradient-to-t from-blue-200/40 via-indigo-100/30 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-indigo-100/40 blur-[100px] pointer-events-none" />

      {/* Centered Forgot Password Card */}
      <div className="relative z-10 w-full flex items-center justify-center py-6">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
