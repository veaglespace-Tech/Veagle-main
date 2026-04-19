"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import { Grid3X3, Rocket } from "lucide-react";

import {
  buildLoginHref,
  buildRegisterHref,
  clearStoredSession,
  readStoredSession,
} from "@/lib/auth-session";
import {
  Panel,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
  selectClass,
  textareaClass,
} from "@/components/site/UiBits";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/site";
import { getErrorMessage } from "@/store/api/baseApi";

const initialState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  serviceInterest: "",
  budget: "",
  timeline: "",
  message: "",
};

const budgetOptions = [
  { value: "", label: "Select budget range" },
  { value: "25k-50k", label: "INR 25k - 50k" },
  { value: "50k-150k", label: "INR 50k - 1.5L" },
  { value: "150k-plus", label: "INR 1.5L+" },
  { value: "guidance", label: "Need budget guidance" },
];

const timelineOptions = [
  { value: "", label: "Select timeline" },
  { value: "rapid-4-8-weeks", label: "Fast launch (4-8 weeks)" },
  { value: "standard-3-6-months", label: "Standard project (3-6 months)" },
  { value: "strategic-6-plus-months", label: "Long-term roadmap (6+ months)" },
  { value: "need-recommendation", label: "Need recommendation" },
];

const accessBannerClass =
  "mb-6 rounded-[1.35rem] border border-[color:var(--border-strong)] bg-[color:var(--surface-muted)] px-4 py-4 text-sm text-[color:var(--text-primary)] shadow-[color:var(--shadow-soft)] backdrop-blur-md";
const compactActionButtonClass =
  "min-h-0 px-4 py-2 text-xs uppercase tracking-[0.18em]";

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Please enter your name";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Please enter a valid email";
  }

  if (!values.phone.trim()) {
    errors.phone = "Please enter your phone number";
  } else if (!/^\+?[0-9\s-]{10,15}$/.test(values.phone)) {
    errors.phone = "Please enter a valid contact number";
  }

  if (!values.message.trim()) {
    errors.message = "Please describe your requirement";
  }

  return errors;
}

export default function LeadCaptureForm({
  compact = false,
  defaultService = "",
  serviceOptions = [],
  appearance = "default",
}) {
  const pathname = usePathname();
  const [form, setForm] = useState({ ...initialState, serviceInterest: defaultService });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState(null);

  const normalizedServiceOptions = useMemo(() => {
    const options = serviceOptions.map((option) =>
      typeof option === "string"
        ? { value: option, label: option }
        : option
    );

    if (defaultService && !options.some((option) => option.value === defaultService)) {
      options.unshift({ value: defaultService, label: defaultService });
    }

    return [{ value: "", label: "Select a service" }, ...options];
  }, [defaultService, serviceOptions]);

  useEffect(() => {
    if (defaultService) {
      setForm((current) => ({ ...current, serviceInterest: defaultService }));
    }
  }, [defaultService]);

  useEffect(() => {
    function syncSession() {
      const nextSession = readStoredSession();
      setSession(nextSession);

      if (nextSession?.token) {
        setForm((current) => ({
          ...current,
          name: nextSession.username || current.name,
          email: nextSession.email || current.email,
          phone: nextSession.contact || current.phone,
        }));
      }
    }

    syncSession();
    window.addEventListener("storage", syncSession);

    return () => {
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const orbitalFieldLabelClass =
    "text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--text-muted)]";
  const orbitalFieldInputClass =
    "mt-2 w-full rounded-[0.95rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3.5 text-sm text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--border-strong)] focus:ring-2 focus:ring-[color:var(--ring)]";
  const sessionLocked = Boolean(session?.token);
  const loginHref = buildLoginHref(pathname || "/contact");
  const registerHref = buildRegisterHref(pathname || "/contact");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    startTransition(async () => {
      try {
        // Build JSON object with separate fields
        const data = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          company: form.company?.trim() || "",
          service: form.serviceInterest?.trim() || "",
          budget: form.budget?.trim() || "",
          timeline: form.timeline?.trim() || "",
          message: form.message.trim(),
        };

        // Send request using fetch API
        const response = await fetch(`${API_BASE_URL}/api/public/contacts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.text();

        setForm({
          ...initialState,
          serviceInterest: defaultService,
          name: session?.username || "",
          email: session?.email || "",
          phone: session?.contact || "",
        });
        setStatus({
          type: "success",
          message: "Thanks. Your requirement has been received and our team will get back to you shortly.",
        });
      } catch (error) {
        setStatus({
          type: "error",
          message: getErrorMessage(
            error,
            "Something went wrong while submitting the form."
          ),
        });
      } finally {
        setIsSubmitting(false);
      }
    });
  }

  if (appearance === "architect") {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-[color:var(--surface-container-high)] p-8 shadow-[color:var(--shadow-soft)] sm:p-10">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[color:var(--accent)]/5 blur-2xl" />

        <div className="relative">
          <AccessBanner
            session={session}
            loginHref={loginHref}
            registerHref={registerHref}
            onLogout={() => {
              clearStoredSession();
              setSession(null);
              setForm((current) => ({
                ...current,
                name: "",
                email: "",
                phone: "",
              }));
            }}
          />
          <h3 className="font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
            Quick Enquiry
          </h3>
          <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">
            Share a quick overview of your requirement and we will get back to you.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <MinimalField
              label="Your Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              readOnly={sessionLocked}
              error={errors.name}
              placeholder="Your name"
            />

            <MinimalField
              label="Work Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              readOnly={sessionLocked}
              error={errors.email}
              placeholder="john@company.com"
            />

            <MinimalTextarea
              label="Project Brief"
              name="message"
              value={form.message}
              onChange={handleChange}
              error={errors.message}
              placeholder="Tell us what you want to build or improve."
            />

            {status.message ? (
              <div
                className={
                  status.type === "success"
                    ? "rounded-xl border px-4 py-3 text-sm font-bold"
                    : "rounded-xl border px-4 py-3 text-sm font-bold"
                }
                style={{
                  backgroundColor: status.type === "success" ? "var(--status-success-bg)" : "var(--status-error-bg)",
                  color: status.type === "success" ? "var(--status-success-text)" : "var(--status-error-text)",
                  borderColor: status.type === "success" ? "var(--status-success-border)" : "var(--status-error-border)",
                }}
              >
                {status.message}
              </div>
            ) : null}

            <button
              className={`${primaryButtonClass} w-full`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Send Enquiry"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (appearance === "orbital") {
    return (
      <div className="relative overflow-hidden rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-8">
        <div className="pointer-events-none absolute right-4 top-4 opacity-25">
          <Grid3X3 className="h-7 w-7 text-[color:var(--text-muted)]" />
        </div>

        <AccessBanner
          session={session}
          loginHref={loginHref}
          registerHref={registerHref}
          onLogout={() => {
            clearStoredSession();
            setSession(null);
            setForm((current) => ({
              ...current,
              name: "",
              email: "",
              phone: "",
            }));
          }}
        />

        <form
          className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <label className="block">
            <span className={orbitalFieldLabelClass}>Full Name</span>
            <input
              className={orbitalFieldInputClass}
              name="name"
              value={form.name}
              onChange={handleChange}
              readOnly={sessionLocked}
              placeholder="Your full name"
            />
            {errors.name ? <FieldError>{errors.name}</FieldError> : null}
          </label>

          <label className="block">
            <span className={orbitalFieldLabelClass}>Company</span>
            <input
              className={orbitalFieldInputClass}
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Business or company name"
            />
            {errors.company ? <FieldError>{errors.company}</FieldError> : null}
          </label>

          <label className="block">
            <span className={orbitalFieldLabelClass}>Email Address</span>
            <input
              className={orbitalFieldInputClass}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              readOnly={sessionLocked}
              placeholder="official@domain.com"
            />
            {errors.email ? <FieldError>{errors.email}</FieldError> : null}
          </label>

          <label className="block">
            <span className={orbitalFieldLabelClass}>Phone Number</span>
            <input
              className={orbitalFieldInputClass}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              readOnly={sessionLocked}
              placeholder="+91"
            />
            {errors.phone ? <FieldError>{errors.phone}</FieldError> : null}
          </label>

          <label className="block">
            <span className={orbitalFieldLabelClass}>Service Needed</span>
            <select
              className={orbitalFieldInputClass}
              name="serviceInterest"
              value={form.serviceInterest}
              onChange={handleChange}
            >
              {normalizedServiceOptions.map((option) => (
                <option
                  key={`orbital-service-${option.value || option.label}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {errors.serviceInterest ? <FieldError>{errors.serviceInterest}</FieldError> : null}
          </label>

          <label className="block">
            <span className={orbitalFieldLabelClass}>Approx Budget</span>
            <select
              className={orbitalFieldInputClass}
              name="budget"
              value={form.budget}
              onChange={handleChange}
            >
              {budgetOptions.map((option) => (
                <option
                  key={`orbital-budget-${option.value || option.label}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {errors.budget ? <FieldError>{errors.budget}</FieldError> : null}
          </label>

          <label className="block md:col-span-2">
            <span className={orbitalFieldLabelClass}>Preferred Timeline</span>
            <select
              className={orbitalFieldInputClass}
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
            >
              {timelineOptions.map((option) => (
                <option
                  key={`orbital-timeline-${option.value || option.label}`}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {errors.timeline ? <FieldError>{errors.timeline}</FieldError> : null}
          </label>

          <label className="block md:col-span-2">
            <span className={orbitalFieldLabelClass}>Project Brief</span>
            <textarea
              className={`${orbitalFieldInputClass} min-h-[128px] resize-none`}
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us what you want to build, improve or launch."
            />
            {errors.message ? <FieldError>{errors.message}</FieldError> : null}
          </label>

          {status.message ? (
            <div
              className="md:col-span-2 rounded-[0.9rem] px-4 py-3 text-sm font-bold border"
              style={{
                backgroundColor: status.type === "success" ? "var(--status-success-bg)" : "var(--status-error-bg)",
                color: status.type === "success" ? "var(--status-success-text)" : "var(--status-error-text)",
                borderColor: status.type === "success" ? "var(--status-success-border)" : "var(--status-error-border)",
              }}
            >
              {status.message}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <button
              className={`${primaryButtonClass} group w-full disabled:cursor-not-allowed disabled:opacity-70`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Send Requirement"}
              <Rocket className="h-4.5 w-4.5 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Panel className="overflow-hidden p-0 border-[color:var(--border)] bg-[color:var(--page-bg)]/40 backdrop-blur-xl">
      <div className="border-b border-[color:var(--border)] bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-6 py-6 text-white sm:px-10 sm:py-8">
        <label className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
          Project Enquiry
        </label>
        <h3 className="mt-4 font-headline text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
          {compact ? "Tell us what you need." : "Let's discuss your requirement."}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-blue-100/70 max-w-lg">
          Share your business goals, preferred service and project details so we can guide the next step clearly.
        </p>
      </div>

      <form className="space-y-5 p-6 sm:p-8" onSubmit={handleSubmit}>
        <AccessBanner
          session={session}
          loginHref={loginHref}
          registerHref={registerHref}
          onLogout={() => {
            clearStoredSession();
            setSession(null);
            setForm((current) => ({
              ...current,
              name: "",
              email: "",
              phone: "",
            }));
          }}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            readOnly={sessionLocked}
            error={errors.name}
            placeholder="Your name"
          />
          <Field
            label="Organization"
            name="company"
            value={form.company}
            onChange={handleChange}
            error={errors.company}
            placeholder="Business or company name"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            readOnly={sessionLocked}
            error={errors.email}
            placeholder="name@domain.com"
          />
          <Field
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            readOnly={sessionLocked}
            error={errors.phone}
            placeholder="+91"
          />
          <SelectField
            label="Service Needed"
            name="serviceInterest"
            value={form.serviceInterest}
            onChange={handleChange}
            options={normalizedServiceOptions}
            error={errors.serviceInterest}
          />
          <SelectField
            label="Approx Budget"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            options={budgetOptions}
            error={errors.budget}
          />
        </div>

        <SelectField
          label="Preferred Timeline"
          name="timeline"
          value={form.timeline}
          onChange={handleChange}
          options={timelineOptions}
          error={errors.timeline}
        />

        <label className="block">
          <span className="text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)] opacity-80">Project Brief</span>
          <textarea
            className={cn(textareaClass, "mt-2 bg-[color:var(--surface-strong)] border-[color:var(--border)] focus:border-[color:var(--accent)] min-h-[100px]")}
            rows={compact ? 3 : 4}
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us what you want to build, what should improve, and what success looks like."
          />
          {errors.message ? <FieldError>{errors.message}</FieldError> : null}
        </label>

        {status.message ? (
          <div
            className="rounded-xl border px-4 py-3 text-xs font-bold"
            style={{
              backgroundColor: status.type === "success" ? "var(--status-success-bg)" : "var(--status-error-bg)",
              color: status.type === "success" ? "var(--status-success-text)" : "var(--status-error-text)",
              borderColor: status.type === "success" ? "var(--status-success-border)" : "var(--status-error-border)",
            }}
          >
            {status.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between border-t border-[color:var(--border)]">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[color:var(--text-muted)] opacity-50">
            Secure enquiry channel
          </p>
          <button className={cn(primaryButtonClass, "w-full sm:w-auto px-8 min-h-[2.8rem] text-xs")} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Requirement"}
          </button>
        </div>
      </form>
    </Panel>
  );
}

function Field({ label, error, ...props }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input className={inputClass} {...props} />
      {error ? <FieldError>{error}</FieldError> : null}
    </label>
  );
}

function SelectField({ label, error, options, ...props }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <select className={selectClass} {...props}>
        {options.map((option) => (
          <option key={`${label}-${option.value || option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <FieldError>{error}</FieldError> : null}
    </label>
  );
}

function FieldError({ children }) {
  return <span className="mt-2 block text-xs text-rose-300">{children}</span>;
}

function AccessBanner({ session, loginHref, registerHref, onLogout }) {
  if (session?.token) {
    return (
      <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-[color:var(--text-primary)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-emerald-600 dark:text-emerald-100">
              Logged in as {session.username || session.email}
            </p>
            <p className="mt-1 text-xs text-emerald-600/80 dark:text-emerald-100/80">
              {session.email}
              {session.contact ? ` / ${session.contact}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className={cn(secondaryButtonClass, compactActionButtonClass)}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={accessBannerClass}>
      <p className="font-semibold text-amber-600 dark:text-amber-200">
        Sign in is optional
      </p>
      <p className="mt-2 text-xs leading-6 text-amber-700 dark:text-amber-100/70">
        You can submit this enquiry directly. If you sign in or create a profile, we can prefill your details for faster follow-up.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={loginHref}
          className={cn(primaryButtonClass, compactActionButtonClass, "bg-amber-600 hover:bg-amber-500 border-transparent text-white font-bold")}
        >
          Sign In
        </Link>
        <Link
          href={registerHref}
          className={cn(secondaryButtonClass, compactActionButtonClass, "border-amber-500/30 text-amber-200 font-bold bg-amber-500/5 hover:bg-amber-500/10")}
        >
          Create Profile
        </Link>
      </div>
    </div>
  );
}

function MinimalField({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
        {label}
      </span>
      <input
        className="mt-2 w-full border-0 border-b border-[color:var(--border)] bg-transparent px-0 py-2 text-sm text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--accent)] focus:ring-0"
        {...props}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </label>
  );
}

function MinimalTextarea({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
        {label}
      </span>
      <textarea
        className="mt-2 w-full resize-none border-0 border-b border-[color:var(--border)] bg-transparent px-0 py-2 text-sm text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--accent)] focus:ring-0"
        rows={3}
        {...props}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </label>
  );
}
