"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import {
  buildLoginHref,
  getSafeNextPath,
} from "@/lib/auth-session";
import { COMPANY_NAME } from "@/lib/site";

const leftPanelItems = [
  {
    title: "Keep everything tracked",
    description: "Registration is optional, but it keeps contact requests and job applications attached to one account.",
    icon: ShieldCheck,
  },
  {
    title: "Faster next steps",
    description: "Returning clients and applicants can reuse the same email flow with OTP-based sign-in.",
    icon: BarChart3,
  },
];

function validate(form, agreed) {
  if (!form.username.trim()) {
    return "Full name is required.";
  }

  if (!form.email.trim()) {
    return "Email address is required.";
  }

  if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    return "Please enter a valid email address.";
  }

  if (!/^\d{10}$/.test(form.contact.trim())) {
    return "Contact number must be exactly 10 digits.";
  }

  if (!form.password.trim()) {
    return "Password is required.";
  }

  if (form.password.trim().length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (!agreed) {
    return "Please accept the website terms to continue.";
  }

  return "";
}

export default function PortalRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const loginHref = buildLoginHref(nextPath);
  const [form, setForm] = useState({
    username: "",
    email: "",
    contact: "",
    password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    const nextValue =
      name === "contact" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setForm((current) => ({ ...current, [name]: nextValue }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate(form, agreed);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const registerPayload = await registerResponse.json();

      if (!registerResponse.ok) {
        setError(registerPayload.error || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully. Redirecting you to OTP sign-in...");
      router.replace(
        `${loginHref}&email=${encodeURIComponent(form.email.trim())}&registered=1`
      );
    } catch {
      setError("Registration is unavailable right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#131314] text-[#e4e2e2]">
      <header className="fixed top-0 z-50 h-20 w-full bg-slate-950/60 shadow-[0_20px_40px_rgba(30,58,138,0.18)] backdrop-blur-xl">
        <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <Rocket className="h-7 w-7 text-[#b3c5ff]" />
            <h1 className="font-headline text-lg font-bold tracking-[-0.03em] text-white sm:text-xl">
              {COMPANY_NAME}
            </h1>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <span className="text-sm uppercase tracking-[0.22em] text-[#c3c6d7]">
              User registration
            </span>
          </div>
        </div>
      </header>

      <main className="relative flex min-h-screen flex-grow items-center justify-center px-6 pb-12 pt-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-[10%] -top-[20%] h-[60%] w-[60%] rounded-full bg-[#195ee2]/10 blur-[120px]" />
          <div className="absolute -bottom-[10%] -left-[5%] h-[40%] w-[40%] rounded-full bg-[#10ae00]/5 blur-[100px]" />
        </div>

        <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] shadow-[0_32px_80px_rgba(0,0,0,0.35)] md:grid-cols-12">
          <div className="relative hidden overflow-hidden bg-slate-950 p-12 md:col-span-5 md:flex md:flex-col md:justify-between">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <Image
                src="/veagle-hero-orbit.svg"
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center rounded-full border border-[#195ee2]/20 bg-[#b3c5ff]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-[#b3c5ff]">
                Registration open
              </div>
              <h2 className="font-headline text-4xl font-bold leading-tight text-white">
                Create your user account.
              </h2>
              <p className="mt-4 font-light leading-relaxed text-[#c3c6d7]">
                Guest enquiry and job application flows already work, and this account simply keeps everything linked to your saved profile.
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-6">
              {leftPanelItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
                      <Icon className="h-5 w-5 text-[#b3c5ff]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{item.title}</h4>
                      <p className="mt-1 text-xs text-[#c3c6d7]">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#1f2020] p-8 md:col-span-7 md:p-12">
            <div className="relative mb-12 flex justify-between">
              <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-white/5" />

              {["Basic Info", "Contact", "Access"].map((step, index) => (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={
                      index === 0
                        ? "flex h-10 w-10 items-center justify-center rounded-full bg-[#195ee2] font-bold text-[#e1e6ff] shadow-[0_12px_24px_rgba(25,94,226,0.35)]"
                        : "flex h-10 w-10 items-center justify-center rounded-full border border-[#424654] bg-[#292a2a] font-bold text-[#c3c6d7]"
                    }
                  >
                    {index + 1}
                  </div>
                  <span
                    className={
                      index === 0
                        ? "text-[10px] font-bold uppercase tracking-[0.24em] text-[#b3c5ff]"
                        : "text-[10px] font-bold uppercase tracking-[0.24em] text-[#c3c6d7]"
                    }
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="font-headline text-2xl font-semibold text-white">
                Register to continue
              </h3>
              <p className="mt-1 text-sm text-[#c3c6d7]">
                Create an account if you want your future enquiries and applications tracked under one identity.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field
                  label="Full Name"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@veaglespace.com"
                  autoComplete="email"
                />
                <Field
                  label="Contact Number"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="9876543210"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                />
                <div className="space-y-2">
                  <label className="ml-1 block text-xs font-medium uppercase tracking-wider text-[#c3c6d7]">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-2xl border-none bg-[#292a2a] px-4 py-3 text-[#e4e2e2] outline-none transition placeholder:text-[#8d90a0] focus:ring-2 focus:ring-[#195ee2]"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      placeholder="************"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8d90a0] transition-colors hover:text-white"
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
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="flex h-5 items-center">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => {
                      setAgreed(event.target.checked);
                      setError("");
                      setSuccess("");
                    }}
                    className="h-5 w-5 rounded-md border-none bg-[#292a2a] text-[#195ee2] focus:ring-[#195ee2] focus:ring-offset-0 focus:ring-offset-[#131314]"
                  />
                </div>
                <label className="text-xs leading-tight text-[#c3c6d7]">
                  I agree to the{" "}
                  <Link href="/contact" className="text-[#b3c5ff] hover:underline">
                    website terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/contact" className="text-[#b3c5ff] hover:underline">
                    privacy policy
                  </Link>
                  .
                </label>
              </div>

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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#195ee2] py-4 font-bold text-[#e1e6ff] shadow-[0_18px_34px_rgba(25,94,226,0.24)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-8 text-center text-xs text-[#c3c6d7]">
                Already registered?{" "}
                <Link href={loginHref} className="font-bold text-[#b3c5ff] hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-white/5 bg-slate-950">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-between gap-4 px-8 py-8 md:flex-row">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Copyright 2026 {COMPANY_NAME}. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link href="/contact" className="text-[10px] uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-blue-300">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-[10px] uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-blue-300">
              Terms
            </Link>
            <Link href="/contact" className="text-[10px] uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-blue-300">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="ml-1 block text-xs font-medium uppercase tracking-wider text-[#c3c6d7]">
        {label}
      </label>
      <input
        className="w-full rounded-2xl border-none bg-[#292a2a] px-4 py-3 text-[#e4e2e2] outline-none transition placeholder:text-[#8d90a0] focus:ring-2 focus:ring-[#195ee2]"
        {...props}
      />
    </div>
  );
}
