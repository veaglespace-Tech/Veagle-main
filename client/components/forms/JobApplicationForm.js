"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import { UploadCloud } from "lucide-react";

import {
  buildLoginHref,
  buildRegisterHref,
  clearStoredSession,
  isUserSession,
  readStoredSession,
} from "@/lib/auth-session";
import {
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/site/UiBits";
import { cn } from "@/lib/utils";
import { useSubmitJobApplicationMutation } from "@/store/api/applications.api";
import { getErrorMessage } from "@/store/api/baseApi";

const initialState = {
  name: "",
  email: "",
  phone: "",
  jobId: "",
  file: null,
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^\+?[0-9\s-]{10,15}$/.test(values.phone)) {
    errors.phone = "Enter a valid phone number";
  }

  if (!values.jobId) {
    errors.jobId = "Select the role you are applying for";
  }

  if (!values.file) {
    errors.file = "Resume is required";
  }

  return errors;
}

const fieldLabelClass =
  "text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-muted)]";
const fieldInputClass =
  "mt-2 w-full rounded-[0.9rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--border-strong)] focus:ring-2 focus:ring-[color:var(--ring)]";
const accessBannerClass =
  "mb-6 rounded-[1.35rem] border border-[color:var(--border-strong)] bg-[linear-gradient(135deg,rgba(25,94,226,0.18),rgba(18,22,30,0.94))] px-4 py-4 text-sm text-[color:var(--text-primary)] shadow-[color:var(--shadow-soft)] backdrop-blur-md";
const compactActionButtonClass =
  "min-h-0 px-4 py-2 text-xs uppercase tracking-[0.18em]";

export default function JobApplicationForm({
  jobs = [],
  className = "",
  showSelectedCard = true,
  preSelectedJobId,
}) {
  const pathname = usePathname();
  const defaultJobId = preSelectedJobId
    ? String(preSelectedJobId)
    : jobs[0]?.id
      ? String(jobs[0].id)
      : "";
  const [form, setForm] = useState({
    ...initialState,
    jobId: defaultJobId,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState(null);
  const [submitJobApplication] = useSubmitJobApplicationMutation();

  const selectedJob = useMemo(
    () => jobs.find((job) => String(job.id) === form.jobId),
    [form.jobId, jobs]
  );
  const userLocked = isUserSession(session);
  const loginHref = buildLoginHref(pathname || "/career");
  const registerHref = buildRegisterHref(pathname || "/career");

  useEffect(() => {
    if (preSelectedJobId) {
      setForm((current) => ({ ...current, jobId: String(preSelectedJobId) }));
      return;
    }

    setForm((current) => {
      if (!defaultJobId) {
        return current.jobId ? { ...current, jobId: "" } : current;
      }

      const exists = jobs.some((job) => String(job.id) === current.jobId);
      return exists ? current : { ...current, jobId: defaultJobId };
    });
  }, [defaultJobId, jobs, preSelectedJobId]);

  useEffect(() => {
    function syncSession() {
      const nextSession = readStoredSession();
      setSession(nextSession);

      if (isUserSession(nextSession)) {
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

  function handleChange(event) {
    const { name, value, files } = event.target;
    const nextValue = name === "file" ? files?.[0] || null : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
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
        // Session is now optional as per the new public API
        await submitJobApplication({
          token: session?.token,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          jobId: form.jobId,
          file: form.file,
        }).unwrap();
        setStatus({
          type: "success",
          message: `Application submitted for ${selectedJob?.title || "the selected role"}.`,
        });
        setForm({
          ...initialState,
          jobId: defaultJobId,
          name: session?.username || "",
          email: session?.email || "",
          phone: session?.contact || "",
        });
      } catch (error) {
        setStatus({
          type: "error",
          message: getErrorMessage(
            error,
            "Unable to submit your application right now."
          ),
        });
      } finally {
        setIsSubmitting(false);
      }
    });
  }

  return (
    <div
      className={cn(
        "rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-8",
        className
      )}
    >
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

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" name="name" value={form.name} onChange={handleChange} readOnly={userLocked} error={errors.name} />
          <Field
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            readOnly={userLocked}
            error={errors.email}
          />
          <Field
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            readOnly={userLocked}
            error={errors.phone}
          />

          <label className="block">
            <span className={fieldLabelClass}>Position Applied</span>
            <select
              className={fieldInputClass}
              name="jobId"
              value={form.jobId}
              onChange={handleChange}
              disabled={!jobs.length}
            >
              <option value="">Select role</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
            {errors.jobId ? <FieldError>{errors.jobId}</FieldError> : null}
          </label>
        </div>

        <label className="block">
          <span className={fieldLabelClass}>Resume / CV Upload</span>
          <div className="relative mt-2 rounded-[1rem] border-2 border-dashed border-[color:var(--border)] bg-[color:var(--surface-muted)] p-5 text-center transition hover:border-[color:var(--border-strong)]">
            <input
              className="absolute inset-0 z-10 cursor-pointer opacity-0"
              type="file"
              accept=".pdf,.doc,.docx"
              name="file"
              onChange={handleChange}
            />
            <UploadCloud className="mx-auto h-7 w-7 text-[color:var(--text-muted)]" />
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
              Drag and drop your file or <span className="font-semibold text-[color:var(--text-primary)]">browse</span>
            </p>
            <p className="mt-1 text-xs text-[color:var(--text-muted)]">
              {form.file?.name || "PDF or DOCX (Max 10MB)"}
            </p>
          </div>
          {errors.file ? <FieldError>{errors.file}</FieldError> : null}
        </label>

        {showSelectedCard && selectedJob ? (
          <div className="rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
              Selected role
            </p>
            <p className="mt-2 text-lg font-semibold text-[color:var(--text-primary)]">{selectedJob.title}</p>
            <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{selectedJob.location}</p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{selectedJob.skills}</p>
          </div>
        ) : null}

        {!jobs.length ? (
          <p className="text-sm text-[color:var(--text-secondary)]">
            No active roles yet. Add jobs from dashboard to enable applications.
          </p>
        ) : null}

        {status.message ? (
          <div
            className={
              status.type === "success"
                ? "rounded-[0.9rem] border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-200"
                : "rounded-[0.9rem] border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-200"
            }
          >
            {status.message}
          </div>
        ) : null}

        <button
          className={cn(
            primaryButtonClass,
            "w-full disabled:cursor-not-allowed disabled:opacity-70"
          )}
          type="submit"
          disabled={isSubmitting || !jobs.length}
        >
          {isSubmitting ? "Submitting..." : "Initiate Application"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, error, ...props }) {
  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <input className={fieldInputClass} {...props} />
      {error ? <FieldError>{error}</FieldError> : null}
    </label>
  );
}

function FieldError({ children }) {
  return <span className="mt-2 block text-xs text-rose-600 dark:text-rose-300">{children}</span>;
}

function AccessBanner({ session, loginHref, registerHref, onLogout }) {
  if (isUserSession(session)) {
    return (
      <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-emerald-800 dark:text-emerald-100">
              Logged in as {session.username || session.email}
            </p>
            <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-100/80">
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
    <div className={cn(accessBannerClass, "border-blue-500/30 bg-blue-500/5")}>
      <p className="font-semibold text-blue-700 dark:text-blue-200">
        Optional: Sign in to auto-fill
      </p>
      <p className="mt-2 text-xs leading-6 text-blue-800/70 dark:text-blue-100/70">
        You can submit as a guest, but creating a profile allows you to track your application and auto-fills your contact details.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={loginHref}
          className={cn(primaryButtonClass, compactActionButtonClass)}
        >
          Sign In
        </Link>
        <Link
          href={registerHref}
          className={cn(secondaryButtonClass, compactActionButtonClass)}
        >
          Create Profile
        </Link>
      </div>
    </div>
  );
}
