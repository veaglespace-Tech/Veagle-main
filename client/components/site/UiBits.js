import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export const pageClass = "relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[color:var(--page-bg)] text-[color:var(--text-secondary)]";
export const containerClass = "mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8";
export const sectionClass = "relative py-16 sm:py-20 lg:py-24";
export const firstSectionClass = "relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40";
export const ctaShellClass = "overflow-hidden !rounded-[2.25rem] sm:!rounded-[2.6rem]";
export const pageHeroTitleClass =
  "font-headline text-3xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl lg:text-6xl";
export const surfaceCardClass =
  "rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-[color:var(--shadow-card)] backdrop-blur-sm sm:p-7";
export const mutedCardClass =
  "rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-5 shadow-[color:var(--shadow-soft)] sm:p-6";
export const eyebrowClass =
  "inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-[color:var(--accent)] shadow-[0_0_20px_rgba(25,94,226,0.12)]";
export const chipClass =
  "inline-flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-3 py-1.5 text-xs font-semibold tracking-[0.08em] text-[color:var(--text-secondary)]";
export const buttonBaseClass =
  "inline-flex min-h-[3.15rem] items-center justify-center gap-2 rounded-full px-6 py-3.5 text-center text-sm font-bold leading-none transition duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--ring)] sm:px-7";
export const primaryButtonClass = cn(
  buttonBaseClass,
  "border border-white/10 bg-[linear-gradient(135deg,#1a2a59,#2563eb)] text-white shadow-[0_10px_30px_rgba(26,42,89,0.3)] hover:-translate-y-1 hover:brightness-110"
);
export const secondaryButtonClass = cn(
  buttonBaseClass,
  "border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-[0_12px_32px_-24px_rgba(15,23,42,0.32)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)]"
);
export const inversePrimaryButtonClass = cn(
  buttonBaseClass,
  "border border-white bg-white text-[#0c0e18] shadow-[0_18px_45px_-24px_rgba(255,255,255,0.42)] hover:-translate-y-1 hover:bg-white/92 hover:text-[#0c0e18]"
);
export const inverseSecondaryButtonClass = cn(
  buttonBaseClass,
  "border border-white/20 bg-white/10 text-white shadow-[0_18px_45px_-28px_rgba(6,12,28,0.52)] backdrop-blur-sm hover:-translate-y-1 hover:border-white/30 hover:bg-white/14"
);
export const buttonGroupClass =
  "flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center";
export const filterButtonClass = (active) =>
  cn(
    "inline-flex min-h-11 items-center justify-center rounded-full px-6 py-2.5 text-center text-sm font-semibold transition duration-300",
    active
      ? "border border-transparent bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-[color:var(--button-ink)] shadow-[color:var(--shadow-accent)]"
      : "border border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[rgba(25,94,226,0.1)] hover:text-[color:var(--text-primary)]"
  );
export const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-secondary)]";
export const inputClass =
  "mt-2 min-h-12 w-full rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none transition duration-200 placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--border-strong)] focus:ring-4 focus:ring-[color:var(--ring)]";
export const selectClass = cn(inputClass, "appearance-none");
export const textareaClass = cn(inputClass, "min-h-[150px] resize-y");
export const tableShellClass =
  "overflow-x-auto rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[color:var(--shadow-soft)]";
export const tableClass =
  "min-w-[680px] w-full border-collapse text-sm [&_th]:border-b [&_th]:border-[color:var(--border)] [&_th]:px-4 [&_th]:py-4 [&_th]:text-left [&_th]:align-top [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.2em] [&_th]:text-[color:var(--text-muted)] [&_td]:border-b [&_td]:border-[color:var(--border)] [&_td]:px-4 [&_td]:py-4 [&_td]:align-top [&_tr:last-child_td]:border-b-0";

export function Eyebrow({ children, className = "" }) {
  return <span className={cn(eyebrowClass, className)}>{children}</span>;
}

export function Chip({ children, className = "" }) {
  return <span className={cn(chipClass, className)}>{children}</span>;
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
}) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-headline text-3xl font-black tracking-tighter text-[color:var(--text-primary)] sm:text-4xl lg:text-[3rem]">
        {title}
      </h2>
      {description ? (
        <p className="text-[0.98rem] leading-8 text-[color:var(--text-secondary)] sm:text-[1.02rem]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function PrimaryLink({ href, children, className = "", tone = "default" }) {
  return (
    <Link
      className={cn(
        tone === "inverse" || tone === "solid-inverse"
          ? inversePrimaryButtonClass
          : primaryButtonClass,
        "group",
        className
      )}
      href={href}
    >
      {children}
      <ArrowRight className="veagle-icon-animate h-4 w-4" />
    </Link>
  );
}

export function SecondaryLink({ href, children, className = "", tone = "default" }) {
  return (
    <Link
      className={cn(
        tone === "solid-inverse"
          ? inversePrimaryButtonClass
          : tone === "inverse"
            ? inverseSecondaryButtonClass
            : secondaryButtonClass,
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
}

export function Panel({ className = "", children }) {
  return <div className={cn(surfaceCardClass, className)}>{children}</div>;
}

export function MetricCard({ value, label }) {
  return (
    <div className={cn(surfaceCardClass, "flex h-full flex-col gap-5 p-5 sm:p-6")}>
      <p className="font-headline text-3xl font-black tracking-tighter text-[color:var(--text-primary)] sm:text-4xl">
        {value}
      </p>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <Panel className="border-dashed text-center">
      <h3 className="font-headline text-lg font-black tracking-tight text-[color:var(--text-primary)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{description}</p>
    </Panel>
  );
}
