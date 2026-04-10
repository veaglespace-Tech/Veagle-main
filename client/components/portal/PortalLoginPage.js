"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  Lock,
  Rocket,
  ShieldCheck,
  User,
  UserCog,
} from "lucide-react";

import {
  buildRegisterHref,
  getSafeNextPath,
  normalizeSessionPayload,
  readStoredSession,
  routeForPortalRole,
  writeStoredSession,
} from "@/lib/auth-session";
import { COMPANY_NAME } from "@/lib/site";

const roleMeta = {
  USER: { id: "USER", label: "User", icon: User },
  ADMIN: { id: "ADMIN", label: "Admin", icon: UserCog },
  SADMIN: { id: "SADMIN", label: "Superadmin", icon: ShieldCheck },
};

export default function PortalLoginPage({
  allowedRoles = ["ADMIN", "SADMIN"],
  defaultRole,
  title = COMPANY_NAME,
  subtitle = "Secure access",
  registerHref = "",
  registerLabel = "Create a user account",
  showRegister,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const prefilledEmail = searchParams.get("email") || "";
  const showRegistrationNotice = searchParams.get("registered") === "1";
  const availableRoles = useMemo(
    () => allowedRoles.map((role) => roleMeta[role]).filter(Boolean),
    [allowedRoles]
  );
  const [form, setForm] = useState({ email: "", password: "" });
  const [selectedRole, setSelectedRole] = useState(
    defaultRole || availableRoles[0]?.id || "USER"
  );
  const [persistSession, setPersistSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpPendingEmail, setOtpPendingEmail] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canRegister =
    typeof showRegister === "boolean"
      ? showRegister
      : allowedRoles.includes("USER");

  const resolvedRegisterHref = registerHref || buildRegisterHref(nextPath);

  useEffect(() => {
    if (!allowedRoles.includes(selectedRole)) {
      setSelectedRole(defaultRole || availableRoles[0]?.id || "USER");
    }
  }, [allowedRoles, availableRoles, defaultRole, selectedRole]);

  useEffect(() => {
    if (prefilledEmail && !form.email) {
      setForm((current) => ({ ...current, email: prefilledEmail }));
    }
  }, [form.email, prefilledEmail]);

  useEffect(() => {
    const session = readStoredSession();

    if (!session) {
      return;
    }

    router.replace(routeForPortalRole(session.role, nextPath));
  }, [nextPath, router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  }

  async function requestOtp() {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Invalid login credentials.");
    }

    if (payload.otpRequired) {
      setOtpPendingEmail(form.email.trim());
      setOtpCode("");
      setOtpMessage(payload.message || "We sent an OTP to your email address.");
      return null;
    }

    if (payload.normalizedRole !== selectedRole) {
      throw new Error(
        `This account is registered as ${payload.normalizedRole}. Please use the matching login page.`
      );
    }

    return payload;
  }

  async function verifyOtp() {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: otpPendingEmail || form.email.trim(),
        otp: otpCode.trim(),
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "OTP verification failed.");
    }

    if (payload.normalizedRole !== selectedRole) {
      throw new Error(
        `This account is registered as ${payload.normalizedRole}. Please use the matching login page.`
      );
    }

    return payload;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    startTransition(async () => {
      try {
        if (otpMessage) {
          if (!otpCode.trim()) {
            setError("Enter the OTP sent to your email.");
            return;
          }

          const payload = await verifyOtp();
          const nextSession = normalizeSessionPayload(payload, persistSession);
          writeStoredSession(nextSession);
          router.replace(routeForPortalRole(payload.normalizedRole, nextPath));
          return;
        }

        const payload = await requestOtp();

        if (!payload) {
          return;
        }

        const nextSession = normalizeSessionPayload(payload, persistSession);
        writeStoredSession(nextSession);
        router.replace(routeForPortalRole(payload.normalizedRole, nextPath));
      } catch (submitError) {
        setError(submitError.message || "Login is unavailable right now.");
      } finally {
        setIsSubmitting(false);
      }
    });
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#131314] px-6 py-10 font-sans text-[#e4e2e2]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(25,94,226,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(179,197,255,0.1),transparent_40%)]" />

      <div className="pointer-events-none fixed bottom-0 right-0 hidden h-1/2 w-1/3 opacity-20 lg:block">
        <Image
          src="/veagle-about-network.svg"
          alt=""
          fill
          priority
          className="object-contain object-bottom"
          unoptimized
        />
      </div>

      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#195ee2] shadow-[0_24px_50px_rgba(25,94,226,0.2)]">
            <Rocket className="h-8 w-8 text-[#e1e6ff]" />
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-[-0.04em] text-white">
            {title}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8d90a0]">
            {subtitle}
          </p>
        </div>

        <div className="relative w-full overflow-hidden rounded-[3rem] bg-[rgba(52,53,53,0.6)] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-[12px] md:p-10">
          <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#b3c5ff] to-transparent opacity-50" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            {availableRoles.length > 1 ? (
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.28em] text-[#8d90a0]">
                  Select access
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableRoles.map((role) => {
                    const Icon = role.icon;
                    const active = selectedRole === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={
                          active
                            ? "flex-1 rounded-full bg-[#195ee2] px-3 py-2 text-xs font-semibold text-[#e1e6ff] transition-all"
                            : "flex-1 rounded-full bg-[#292a2a] px-3 py-2 text-xs font-medium text-[#c3c6d7] transition-colors hover:bg-[#343535]"
                        }
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Icon className="h-3.5 w-3.5" />
                          {role.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : availableRoles[0] ? (
              <div className="rounded-full border border-white/8 bg-[#1d222d] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b3c5ff]">
                {availableRoles[0].label} access
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  className="ml-1 text-xs font-medium text-[#c3c6d7]"
                  htmlFor="portal-identifier"
                >
                  Email address
                </label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8d90a0]" />
                  <input
                    id="portal-identifier"
                    className="w-full rounded-2xl border-none bg-[#292a2a] py-4 pl-12 pr-4 text-[#e4e2e2] outline-none transition placeholder:text-[#8d90a0]/50 focus:ring-2 focus:ring-[#b3c5ff]/50"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@veaglespace.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="ml-1 text-xs font-medium text-[#c3c6d7]"
                  htmlFor="portal-password"
                >
                  {otpMessage ? "One-time password" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8d90a0]" />
                  {otpMessage ? (
                    <input
                      id="portal-password"
                      className="w-full rounded-2xl border-none bg-[#292a2a] py-4 pl-12 pr-4 text-[#e4e2e2] outline-none transition placeholder:text-[#8d90a0]/50 focus:ring-2 focus:ring-[#b3c5ff]/50"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      value={otpCode}
                      onChange={(event) => {
                        setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                        setError("");
                      }}
                      placeholder="Enter 6-digit OTP"
                    />
                  ) : (
                    <>
                      <input
                        id="portal-password"
                        className="w-full rounded-2xl border-none bg-[#292a2a] py-4 pl-12 pr-12 text-[#e4e2e2] outline-none transition placeholder:text-[#8d90a0]/50 focus:ring-2 focus:ring-[#b3c5ff]/50"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="************"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8d90a0] transition-colors hover:text-[#e4e2e2]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </>
                  )}
                </div>
                {otpMessage ? (
                  <p className="ml-1 text-xs leading-6 text-[#8d90a0]">
                    {otpMessage} Verify for <span className="font-semibold text-[#dbe1ff]">{otpPendingEmail || form.email}</span>.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-medium">
              <label className="group flex cursor-pointer items-center gap-2">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={persistSession}
                    onChange={(event) => setPersistSession(event.target.checked)}
                    className="peer h-4 w-4 appearance-none rounded bg-[#343535] checked:bg-[#195ee2]"
                  />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[12px] font-bold text-[#e1e6ff] opacity-0 peer-checked:opacity-100">
                    x
                  </span>
                </div>
                <span className="text-[#c3c6d7] transition-colors group-hover:text-[#e4e2e2]">
                  Remember this device
                </span>
              </label>

              {otpMessage ? (
                <button
                  type="button"
                  onClick={() => {
                    setOtpMessage("");
                    setOtpCode("");
                    setOtpPendingEmail("");
                    setError("");
                  }}
                  className="text-[#b3c5ff] transition-colors hover:text-[#dbe1ff]"
                >
                  Use another account
                </button>
              ) : (
                <Link
                  href="/contact"
                  className="text-[#b3c5ff] transition-colors hover:text-[#dbe1ff]"
                >
                  Need help?
                </Link>
              )}
            </div>

            {showRegistrationNotice && !otpMessage ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                Account created successfully. Sign in once to receive your OTP.
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#195ee2] to-[#0054d7] py-4 font-headline text-lg font-bold text-[#e1e6ff] shadow-[0_20px_40px_rgba(25,94,226,0.3)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? otpMessage
                  ? "Verifying..."
                  : "Signing in..."
                : otpMessage
                  ? "Verify OTP"
                  : "Sign in"}
              <ArrowRight className="h-5 w-5" />
            </button>

            {otpMessage ? (
              <button
                type="button"
                className="w-full text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#8d90a0] transition-colors hover:text-[#dbe1ff]"
                onClick={() => {
                  setError("");
                  setIsSubmitting(true);
                  startTransition(async () => {
                    try {
                      await requestOtp();
                    } catch (submitError) {
                      setError(submitError.message || "Unable to resend OTP.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  });
                }}
                disabled={isSubmitting}
              >
                Resend OTP
              </button>
            ) : null}
          </form>

          {canRegister ? (
            <div className="mt-8 border-t border-white/5 pt-6 text-center">
              <p className="text-xs text-[#c3c6d7]">
                New here?{" "}
                <Link
                  href={resolvedRegisterHref}
                  className="font-semibold text-[#56e240] hover:underline"
                >
                  {registerLabel}
                </Link>
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-full border border-white/5 bg-[#1b1c1c] px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#56e240] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#56e240]" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#56e240]">
              Website access online
            </span>
          </div>
        </div>
      </div>

      <footer className="relative z-10 mt-auto pt-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
          Copyright 2026 {COMPANY_NAME}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
