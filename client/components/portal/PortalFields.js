"use client";

import { Fragment } from "react";
import { FilePenLine, Sparkles, Trash2 } from "lucide-react";

import {
  Eyebrow,
  inputClass,
  labelClass,
  selectClass,
  tableClass,
  tableShellClass,
  textareaClass,
} from "@/components/site/UiBits";
import { cn } from "@/lib/utils";

export const portalShellClass =
  "relative min-h-screen bg-[radial-gradient(circle_at_top_left,var(--glow-one),transparent_24%),radial-gradient(circle_at_85%_18%,var(--glow-two),transparent_18%),linear-gradient(180deg,var(--page-bg-soft),var(--page-bg))]";
export const portalLayoutClass =
  "relative z-10 grid min-h-screen lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]";
export const portalSidebarClass =
  "border-b border-[color:var(--border)] bg-[linear-gradient(180deg,#10141d,#171b24)] p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-6";
export const portalCardClass =
  "rounded-[1.8rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(26,29,35,0.96),rgba(20,23,29,0.94))] p-5 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-6";
export const portalSubcardClass =
  "rounded-[1.4rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(27,31,39,0.96),rgba(20,23,29,0.92))] p-4 shadow-[var(--shadow-soft)]";
export const portalTabListClass = "grid gap-2 sm:grid-cols-2 lg:grid-cols-1";
export const portalTabClass = (active) =>
  cn(
    "group flex w-full items-center gap-3 rounded-[1.3rem] border px-4 py-3.5 text-left text-sm font-semibold transition duration-300 [&_svg]:shrink-0",
    active
      ? "border-[#4e85f3] bg-[linear-gradient(135deg,rgba(25,94,226,0.24),rgba(179,197,255,0.16))] text-white shadow-[var(--shadow-accent)]"
      : "border-[color:var(--border)] bg-[rgba(255,255,255,0.03)] text-[color:var(--text-secondary)] hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:bg-[rgba(25,94,226,0.08)] hover:text-white"
  );
export const portalButtonPrimaryClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] px-5 py-3 text-sm font-bold text-[color:var(--button-ink)] shadow-[var(--shadow-accent)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60";
export const portalButtonSecondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[rgba(255,255,255,0.04)] px-5 py-3 text-sm font-semibold text-[color:var(--text-primary)] shadow-[var(--shadow-soft)] backdrop-blur-[12px] transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:bg-[rgba(25,94,226,0.1)] disabled:cursor-not-allowed disabled:opacity-60";
export const portalInputClass = inputClass;
export const portalSelectClass = selectClass;
export const portalTextareaClass = textareaClass;
export const portalTableShellClass =
  `${tableShellClass} border border-[color:var(--border)] bg-[color:var(--surface)]`;
export const portalTableClass =
  `${tableClass} [&_thead]:bg-[color:var(--surface-muted)] [&_thead]:text-[color:var(--text-primary)]`;

export function DashboardIntro({ title, description }) {
  return (
    <div className="space-y-4">
      <Eyebrow>Workspace</Eyebrow>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--accent-contrast)] text-[color:var(--accent)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="font-headline text-3xl font-black tracking-tighter text-[color:var(--text-primary)] lg:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MetricTile({ label, value }) {
  return (
    <div className={`${portalCardClass} relative overflow-hidden`}>
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[color:var(--accent-soft)] blur-2xl" />
      <p className="relative z-10 text-[11px] font-bold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
        {label}
      </p>
      <p className="relative z-10 mt-4 font-headline text-4xl font-black tracking-tighter text-[color:var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

export function Card({ title, children }) {
  return (
    <section className={`${portalCardClass} overflow-hidden`}>
      <div className="border-b border-[color:var(--border)] pb-4">
        <h2 className="font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

export function GridList({ items, renderItem }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {items.map((item, index) => {
        const key =
          item?.id ??
          item?.slug ??
          item?.email ??
          item?.title ??
          item?.name ??
          index;

        return <Fragment key={key}>{renderItem(item, index)}</Fragment>;
      })}
    </div>
  );
}

export function ItemCard({
  title,
  subtitle,
  description,
  tags = [],
  extraActionLabel,
  onExtraAction,
  onEdit,
  onDelete,
  busyDelete,
}) {
  return (
    <article className={`${portalCardClass} h-full`}>
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="space-y-4">
          <div>
            <h3 className="font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-2 break-words text-sm text-[color:var(--text-secondary)]">{subtitle}</p>
            ) : null}
          </div>
          {description ? (
            <p className="text-sm leading-7 text-[color:var(--text-secondary)]">{description}</p>
          ) : null}
          {tags.length ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <StatusBadge key={`${title}-${tag}`} value={tag} />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {onExtraAction ? (
            <button type="button" className={portalButtonSecondaryClass} onClick={onExtraAction}>
              {extraActionLabel}
            </button>
          ) : null}
          {onEdit ? (
            <button type="button" className={portalButtonSecondaryClass} onClick={onEdit}>
              <FilePenLine className="h-4 w-4" />
              Edit
            </button>
          ) : null}
          {onDelete ? (
            <button type="button" className={portalButtonSecondaryClass} onClick={onDelete} disabled={busyDelete}>
              <Trash2 className="h-4 w-4" />
              {busyDelete ? "Deleting..." : "Delete"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function InputField({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        className={portalInputClass}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function TextAreaField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <textarea
        className={portalTextareaClass}
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <select
        className={portalSelectClass}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FileField({ label, onChange }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        className={`${portalInputClass} file:mr-4 file:rounded-xl file:border-0 file:bg-[color:var(--accent)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--button-ink)]`}
        type="file"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
    </label>
  );
}

export function ListEditor({ title, items, fields, onAdd, onRemove, onChange }) {
  return (
    <Card title={title}>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className={portalSubcardClass}>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) =>
                field.multiline ? (
                  <div key={field.key} className="md:col-span-2">
                    <TextAreaField
                      label={field.label}
                      value={item[field.key]}
                      onChange={(value) => onChange(index, field.key, value)}
                    />
                  </div>
                ) : (
                  <InputField
                    key={field.key}
                    label={field.label}
                    value={item[field.key]}
                    onChange={(value) => onChange(index, field.key, value)}
                  />
                )
              )}
            </div>
            <div className="mt-4">
              <button type="button" className={portalButtonSecondaryClass} onClick={() => onRemove(index)}>
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" className={portalButtonSecondaryClass} onClick={onAdd}>
          Add item
        </button>
      </div>
    </Card>
  );
}

export function StringListEditor({
  title,
  items,
  label = "Item",
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <Card title={title}>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className={portalSubcardClass}>
            <InputField
              label={label}
              value={item}
              onChange={(value) => onChange(index, value)}
            />
            <div className="mt-4">
              <button type="button" className={portalButtonSecondaryClass} onClick={() => onRemove(index)}>
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" className={portalButtonSecondaryClass} onClick={onAdd}>
          Add item
        </button>
      </div>
    </Card>
  );
}

export function StatusBadge({ value }) {
  const normalized = (value || "").toLowerCase();
  const tone =
    normalized === "active" ||
    normalized === "done" ||
    normalized === "qualified" ||
    normalized === "selected"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
      : normalized === "blocked" ||
          normalized === "high" ||
          normalized === "new" ||
          normalized === "applied"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
        : normalized === "contacted" || normalized === "in-progress"
          ? "border-sky-500/20 bg-sky-500/10 text-sky-200"
          : normalized === "rejected"
            ? "border-rose-500/20 bg-rose-500/10 text-rose-200"
          : "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--text-secondary)]";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]",
        tone
      )}
    >
      {value}
    </span>
  );
}
