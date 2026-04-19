"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

import { COMPANY_NAME } from "@/lib/site";
import { getErrorMessage } from "@/store/api/baseApi";
import { useResetPasswordMutation } from "@/store/api/auth.api";

function validatePassword(password, confirmPassword) {
  if (!password.trim()) {
    return "New password is required.";
  }

  if (password.trim().length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (!confirmPassword.trim()) {
    return "Please confirm your new password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
}

export default function PortalSetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() || "";
  const redirectTimerRef = useRef(null);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("This password link is invalid or incomplete.");
      return;
    }

    const validationError = validatePassword(
      form.password,
      form.confirmPassword
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        token,
        password: form.password,
      }).unwrap();

      setSuccess("Password set successfully. Redirecting to login...");
      redirectTimerRef.current = window.setTimeout(() => {
        router.replace("/login?passwordSet=1");
      }, 1200);
    } catch (submitError) {
      setError(
        getErrorMessage(
          submitError,
          "We could not set your password right now."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[color:var(--page-bg)] px-6 py-10 text-[color:var(--text-secondary)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(25,94,226,0.18),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(179,197,255,0.1),transparent_40%)]" />

      <div className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[2.5rem] bg-[rgba(52,53,53,0.68)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-[12px] md:p-10">
        <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[color:var(--accent-soft)] to-transparent opacity-50" />

        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--accent)] shadow-[0_24px_50px_rgba(25,94,226,0.2)]">
            <ShieldCheck className="h-8 w-8 text-[#e1e6ff]" />
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-[-0.04em] text-white">
            Reset Password
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8d90a0]">
            {COMPANY_NAME} account access
          </p>
          <p className="mt-4 text-sm leading-7 text-[#c3c6d7]">
            Choose a new password to finish account setup or complete a token-based password reset from your email.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <PasswordField
            id="set-password"
            label="New password"
            name="password"
            placeholder="Enter new password"
            value={form.password}
            onChange={handleChange}
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword((current) => !current)}
          />

          <PasswordField
            id="set-password-confirm"
            label="Confirm password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword((current) => !current)}
          />

          {!token ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              This page needs a valid token from your email. Open the full reset-password link you received to continue.
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-strong)] py-4 font-headline text-lg font-bold text-[#e1e6ff] shadow-[0_20px_40px_rgba(25,94,226,0.3)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span>{isSubmitting ? "Saving..." : "Set password"}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#c3c6d7]">
          Already have your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[color:var(--accent-soft)] transition-colors hover:text-[#dbe1ff]"
          >
            Go to login
          </Link>
        </div>
      </div>
    </main>
  );
}

function PasswordField({
  id,
  label,
  name,
  value,
  placeholder,
  onChange,
  showPassword,
  onToggleVisibility,
}) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-xs font-medium text-[#c3c6d7]" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8d90a0]" />
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete="new-password"
          placeholder={placeholder}
          className="w-full rounded-2xl border-none bg-[#292a2a] py-4 pl-12 pr-12 text-[color:var(--text-secondary)] outline-none transition placeholder:text-[#8d90a0]/50 focus:ring-2 focus:ring-[color:var(--accent-soft)]/50"
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8d90a0] transition-colors hover:text-[color:var(--text-secondary)]"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
