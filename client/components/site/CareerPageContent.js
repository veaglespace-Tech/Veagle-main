"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Rocket,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import JobApplicationForm from "@/components/forms/JobApplicationForm";
import { pageHeroTitleClass } from "@/components/site/UiBits";
import { pageArtwork } from "@/lib/visuals";

const highlightIcons = [Rocket, TrendingUp, ShieldCheck];

function renderHeroTitle(value) {
  const title =
    value ||
    "Build the next generation of websites, software and digital solutions.";
  const marker = "digital solutions";
  const index = title.toLowerCase().indexOf(marker);

  if (index === -1) {
    return title;
  }

  const start = title.slice(0, index);
  const focus = title.slice(index, index + marker.length);
  const end = title.slice(index + marker.length);

  return (
    <>
      {start}
      <span className="text-[color:var(--accent)]">{focus}</span>
      {end}
    </>
  );
}

function splitSkills(value = "") {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function formatPostedLabel(value) {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "Posted recently";
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days <= 0) {
    return "Posted today";
  }

  if (days === 1) {
    return "Posted 1 day ago";
  }

  if (days < 30) {
    return `Posted ${days} days ago`;
  }

  return `Posted ${new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)}`;
}

function resolveWorkMode(value = "") {
  const location = value.toLowerCase();

  if (location.includes("remote")) {
    return "Remote";
  }

  if (location.includes("hybrid")) {
    return "Hybrid";
  }

  if (location.includes("on-site") || location.includes("onsite")) {
    return "On-site";
  }

  return "On-site";
}

function modeBadgeClasses(mode) {
  if (mode === "Remote") {
    return "bg-[#56e240]/15 text-[#74ef62]";
  }

  if (mode === "Hybrid") {
    return "bg-[color:var(--accent)]/16 text-[color:var(--accent)]";
  }

  return "bg-[#ffb1c5]/16 text-[#ffc7d5]";
}

function resolveDepartment(job) {
  const text = `${job?.title || ""} ${job?.skills || ""}`.toLowerCase();

  if (/(design|ux|ui|graphic)/i.test(text)) {
    return "Design";
  }

  if (/(marketing|seo|growth|content)/i.test(text)) {
    return "Marketing";
  }

  if (/(sales|business|support|client)/i.test(text)) {
    return "Business";
  }

  return "Engineering";
}

function departmentChips(jobs) {
  const counter = new Map();

  jobs.forEach((job) => {
    const department = resolveDepartment(job);
    counter.set(department, (counter.get(department) || 0) + 1);
  });

  return [...counter.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 2)
    .map(([name, count]) => ({ name, count }));
}

export default function CareerPageContent({ jobs, content }) {
  const career = content?.career || {};
  const highlights =
    Array.isArray(career?.highlights) && career.highlights.length
      ? career.highlights.slice(0, 3)
      : [];
  const reasons =
    Array.isArray(career?.reasons) && career.reasons.length
      ? career.reasons.slice(0, 3)
      : [];
  const [selectedJob, setSelectedJob] = useState(jobs[0] || null);
  const formRef = useRef(null);
  const filters = departmentChips(jobs);

  function handleJobClick(job) {
    setSelectedJob(job);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <main className="overflow-hidden bg-[color:var(--page-bg)] text-[color:var(--text-secondary)]">
      {/* Hero Section - Permanently Dark */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#0c0e18] px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="absolute inset-0">
          <Image
            src={pageArtwork.hero}
            alt="Career command background"
            fill
            className="object-cover opacity-50 brightness-[0.4]"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e18]/90 via-[#0c0e18]/40 to-[#0c0e18]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0c0e18_100%)] opacity-80" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-blue-100/60">
            {career.eyebrow || "Careers at Veagle Space"}
            </span>
          <h1 className={`mx-auto mt-8 max-w-4xl ${pageHeroTitleClass} text-white`}>
            {renderHeroTitle(career.title)}
          </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-blue-100/70 sm:text-lg">
              {career.description ||
              "Join a team working on practical website, software, design, marketing and support projects for real businesses."}
            </p>
        </div>
      </section>

      {highlights.length ? (
        <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="mx-auto grid w-full max-w-screen-2xl gap-5 md:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = highlightIcons[index % highlightIcons.length];

              return (
                <article
                  key={item.title}
                  className="group veagle-premium-card rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04]">
                    <Icon className="veagle-icon-animate h-5 w-5 text-white" />
                  </div>
                  <h2 className="font-headline text-2xl font-black tracking-tight text-white">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--text-muted)]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="veagle-inverse-surface bg-[#0d0f13] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-screen-2xl">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-headline text-4xl font-black tracking-tight text-white sm:text-5xl">
                Open Positions
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">
                Select a role and apply directly. We are looking for people who can learn fast, communicate clearly and build practical outcomes.
              </p>
            </div>
            {filters.length ? (
              <div className="flex flex-wrap gap-3">
                {filters.map((item) => (
                  <span
                    key={item.name}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--text-secondary)]"
                  >
                    {item.name} ({item.count})
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {jobs.length ? (
            <div className="space-y-4">
              {jobs.map((job) => {
                const mode = resolveWorkMode(job.location);
                const tags = splitSkills(job.skills);
                const isSelected = selectedJob?.id === job.id;

                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => handleJobClick(job)}
                    className={`group veagle-premium-card flex w-full flex-col justify-between gap-6 rounded-[1.15rem] border p-6 text-left ${
                      isSelected
                        ? "border-[color:var(--accent)]/60 bg-[color:var(--surface-strong)] shadow-[0_0_30px_rgba(0,0,0,0.05)]"
                        : "border-[color:var(--border)] bg-[color:var(--surface)]"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-[0.6rem] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${modeBadgeClasses(mode)}`}
                        >
                          {mode}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                          {formatPostedLabel(job.createdAt)}
                        </span>
                        {isSelected ? (
                          <span className="rounded-[0.6rem] bg-white text-black px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]">
                            Selected
                          </span>
                        ) : null}
                      </div>

                      <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                        {job.title}
                      </h3>

                      {tags.length ? (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <span
                              key={`${job.id}-${tag}`}
                              className="rounded-[0.55rem] border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {job.description ? (
                        <p className="line-clamp-3 max-w-3xl text-sm leading-7">{job.description}</p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between gap-5 md:flex-col md:items-end md:justify-center">
                      <div className="text-left md:text-right">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                          Location
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white md:justify-end">
                          <MapPin className="veagle-icon-animate h-4 w-4" />
                          {job.location}
                        </p>
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 text-white">
                        <ArrowUpRight className="veagle-icon-animate h-4.5 w-4.5" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="veagle-inverse-surface rounded-[1.2rem] border border-dashed border-white/12 bg-[#171b22] px-6 py-12 text-center">
              <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                No open positions yet
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/75">
                Add jobs from the dashboard and this section will update automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div ref={formRef} id="apply-section" className="mx-auto grid w-full max-w-screen-xl gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
          <div>
            <h2 className="font-headline text-4xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-5xl">
              {career.applyTitle || "Apply for the role"}
            </h2>
            <p className="mt-5 text-sm leading-8 text-[color:var(--text-secondary)]">
              {career.applyDescription ||
                "Share your details and resume. Our team reviews every profile for skill fit, communication and project alignment."}
            </p>

            <div className="veagle-inverse-surface mt-10 overflow-hidden rounded-[1.2rem] border border-white/8 bg-[linear-gradient(150deg,#1a2a59,#0c0e18)] p-6 shadow-[0_24px_70px_rgba(2,7,22,0.35)]">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/70">
                Selected Role
              </p>
              <h3 className="mt-2 font-headline text-3xl font-black tracking-tight text-white">
                {selectedJob?.title || "Pending Selection"}
              </h3>
              <p className="mt-2 text-sm text-white/80">
                {selectedJob?.location || "Choose a role above to proceed with the application."}
              </p>

              <div className="mt-6 space-y-3">
                {reasons.length ? (
                  reasons.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-white/85">
                      <CheckCircle2 className="h-4.5 w-4.5 text-white/65" />
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 text-sm text-white/85">
                    <CheckCircle2 className="h-4.5 w-4.5 text-white/65" />
                    <span>We review applications and get back with the next steps when there is a fit.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <JobApplicationForm
            jobs={jobs}
            showSelectedCard={false}
            preSelectedJobId={selectedJob?.id}
          />
        </div>
      </section>
    </main>
  );
}
