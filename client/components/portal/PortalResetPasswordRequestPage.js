"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, AtSign, Mail, ShieldCheck } from "lucide-react";

import { COMPANY_NAME } from "@/lib/site";
import { getErrorMessage } from "@/store/api/baseApi";
import { useResetPasswordLinkSendMutation } from "@/store/api/auth.api";

function validateEmail(email) {
  if (!email.trim()) {
    return "Email address is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Please enter a valid email address.";
  }

  return "";
}

export default function PortalResetPasswordRequestPage() {
  const router = useRouter();
  const redirectTimerRef = useRef(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetPasswordLinkSend] = useResetPasswordLinkSendMutation();

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  function handleChange(event) {
    setEmail(event.target.value);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPasswordLinkSend(email.trim()).unwrap();
      setSuccess("Password reset link sent successfully. Check your email for instructions.");
      redirectTimerRef.current = window.setTimeout(() => {
        router.replace("/login?resetRequested=1");
      }, 3000);
    } catch (submitError) {
      setError(
        getErrorMessage(
          submitError,
          "We could not send the reset link right now. Please try again."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[color:var(--page-bg)] px-6 py-10 font-sans text-[color:var(--text-secondary)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(25,94,226,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(179,197,255,0.1),transparent_40%)]" />

      <div className="pointer-events-none fixed bottom-0 right-0 hidden h-1/2 w-1/3 opacity-20 lg:block">
        <div className="h-full w-full bg-gradient-to-br from-transparent to-[color:var(--accent)]/10" />
      </div>

      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--accent)] shadow-[0_24px_50px_rgba(25,94,226,0.2)]">
            <ShieldCheck className="h-8 w-8 text-[#e1e6ff]" />
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-[-0.04em] text-white">
            Reset Password
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8d90a0]">
            Enter your email to receive reset instructions
          </p>
        </div>

        <div className="relative w-full overflow-hidden rounded-[3rem] bg-[rgba(52,53,53,0.6)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-[12px] md:p-10">
          <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[color:var(--accent-soft)] to-transparent opacity-50" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="ml-1 text-xs font-medium text-[#c3c6d7]"
                  htmlFor="reset-email"
                >
                  Email address
                </label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8d90a0]" />
                  <input
                    id="reset-email"
                    className="w-full rounded-2xl border-none bg-[#292a2a] py-4 pl-12 pr-4 text-[color:var(--text-secondary)] outline-none transition placeholder:text-[#8d90a0]/50 focus:ring-2 focus:ring-[color:var(--accent-soft)]/50"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="name@veaglespace.com"
                    disabled={isSubmitting || !!success}
                  />
                </div>
                <p className="ml-1 text-xs leading-6 text-[#8d90a0]">
                  We'll send a secure link to reset your password.
                </p>
              </div>
            </div>

            {success ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    {success}
                  </div>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-strong)] py-4 font-headline text-lg font-bold text-[#e1e6ff] shadow-[0_20px_40px_rgba(25,94,226,0.3)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isSubmitting || !!success}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#e1e6ff]/30 border-t-[#e1e6ff]" />
                  Sending...
                </>
              ) : success ? (
                "Redirecting to login..."
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-xs text-[color:var(--accent-soft)] transition-colors hover:text-[#dbe1ff]"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}