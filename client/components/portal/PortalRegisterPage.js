"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import {
  buildLoginHref,
  getSafeNextPath,
} from "@/lib/auth-session";
import { COMPANY_NAME } from "@/lib/site";
import { useRegisterMutation } from "@/store/api/auth.api";
import { getErrorMessage } from "@/store/api/baseApi";

const leftPanelItems = [
  {
    title: "Keep everything tracked",
    description:
      "Registration is optional, but it keeps contact requests and job applications attached to one account.",
    icon: ShieldCheck,
  },
  {
    title: "Activate from your email",
    description:
      "We send a secure set-password link to your inbox so you can activate the account from one verified email step.",
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

  if (!agreed) {
    return "Please accept the website terms to continue.";
  }

  return "";
}

export default function PortalRegisterPage() {
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get("next"));
  const loginHref = buildLoginHref(nextPath);
  const [form, setForm] = useState({
    username: "",
    email: "",
    contact: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerAccount] = useRegisterMutation();

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
      await registerAccount(form).unwrap();

      setSuccess(
        `Account created successfully. We sent a set-password link to ${form.email.trim()}.`
      );
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Registration is unavailable right now."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[color:var(--page-bg)] text-[color:var(--text-secondary)]">
      <header className="fixed top-0 z-50 h-20 w-full bg-slate-950/60 shadow-[0_20px_40px_rgba(30,58,138,0.18)] backdrop-blur-xl">
        <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <Rocket className="h-7 w-7 text-[color:var(--accent-soft)]" />
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
          <div className="absolute -right-[10%] -top-[20%] h-[60%] w-[60%] rounded-full bg-[color:var(--accent)]/10 blur-[120px]" />
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
              <div className="mb-6 inline-flex items-center rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent-soft)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-tight text-[color:var(--accent-soft)]">
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
                      <Icon className="h-5 w-5 text-[color:var(--accent-soft)]" />
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

              {["Basic Info", "Contact", "Activation"].map((step, index) => (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={
                      index === 0
                        ? "flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent)] font-bold text-[#e1e6ff] shadow-[0_12px_24px_rgba(25,94,226,0.35)]"
                        : "flex h-10 w-10 items-center justify-center rounded-full border border-[#424654] bg-[#292a2a] font-bold text-[#c3c6d7]"
                    }
                  >
                    {index + 1}
                  </div>
                  <span
                    className={
                      index === 0
                        ? "text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--accent-soft)]"
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
                Create an account if you want your future enquiries and applications tracked under one identity. We will email you a secure link to set your password.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                    className="h-5 w-5 rounded-md border-none bg-[#292a2a] text-[color:var(--accent)] focus:ring-[color:var(--accent)] focus:ring-offset-0 focus:ring-offset-[color:var(--page-bg)]"
                  />
                </div>
                <label className="text-xs leading-tight text-[#c3c6d7]">
                  I agree to the{" "}
                  <Link href="/contact" className="text-[color:var(--accent-soft)] hover:underline">
                    website terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/contact" className="text-[color:var(--accent-soft)] hover:underline">
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
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] py-4 font-bold text-[#e1e6ff] shadow-[0_18px_34px_rgba(25,94,226,0.24)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-8 text-center text-xs text-[#c3c6d7]">
                Already registered?{" "}
                <Link href={loginHref} className="font-bold text-[color:var(--accent-soft)] hover:underline">
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
        className="w-full rounded-2xl border-none bg-[#292a2a] px-4 py-3 text-[color:var(--text-secondary)] outline-none transition placeholder:text-[#8d90a0] focus:ring-2 focus:ring-[color:var(--accent)]"
        {...props}
      />
    </div>
  );
}
