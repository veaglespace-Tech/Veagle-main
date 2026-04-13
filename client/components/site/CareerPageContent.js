import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Rocket,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import JobApplicationForm from "@/components/forms/JobApplicationForm";
import { pageArtwork } from "@/lib/visuals";

const highlightIcons = [Rocket, TrendingUp, ShieldCheck];

function renderHeroTitle(value) {
  const title =
    value ||
    "Join a team that builds software, websites and practical digital experiences.";
  const marker = "practical digital experiences";
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
      <span className="text-[#1f67f3]">{focus}</span>
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
    return "bg-[color:var(--accent)]/16 text-[#9db8ff]";
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
  const selectedJob = jobs[0] || null;
  const filters = departmentChips(jobs);

  return (
    <main className="overflow-hidden bg-[color:var(--page-bg)] text-[color:var(--text-secondary)]">
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="absolute inset-0">
          <Image
            src={pageArtwork.hero}
            alt="Career command background"
            fill
            className="object-cover opacity-35"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,19,0.52),rgba(10,12,18,0.92))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(25,94,226,0.28),transparent_34%),radial-gradient(circle_at_76%_14%,rgba(86,226,64,0.1),transparent_30%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/12 bg-[#1a1d24]/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b9c9f0]">
            {career.eyebrow || "Orbital careers"}
          </span>
          <h1 className="mx-auto mt-8 max-w-4xl font-headline text-4xl font-black leading-[0.93] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            {renderHeroTitle(career.title)}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#c3cee3] sm:text-lg">
            {career.description ||
              "Add careers-page copy from the dashboard and publish live openings from the backend jobs API."}
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
                  className="rounded-[1.2rem] border border-white/8 bg-[#1b1f27]/90 p-6 transition hover:border-[#6a8fff]/35 hover:bg-[#202632]"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04] text-[#9cb6ff]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-headline text-2xl font-black tracking-tight text-white">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#bec9de]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="bg-[#0d0f13] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-screen-2xl">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-headline text-4xl font-black tracking-tight text-white sm:text-5xl">
                Open Positions
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#aebad2]">
                Find your role in our product and engineering teams. New openings from dashboard will appear here automatically.
              </p>
            </div>
            {filters.length ? (
              <div className="flex flex-wrap gap-3">
                {filters.map((item) => (
                  <span
                    key={item.name}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c5d1e8]"
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

                return (
                  <article
                    key={job.id}
                    className="group flex flex-col justify-between gap-6 rounded-[1.15rem] border border-white/8 bg-[#191d24]/92 p-6 transition duration-300 hover:border-[#6f95ff]/40 hover:bg-[#1f2530] md:flex-row md:items-center md:gap-8"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-[0.6rem] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${modeBadgeClasses(mode)}`}
                        >
                          {mode}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8793ad]">
                          {formatPostedLabel(job.createdAt)}
                        </span>
                      </div>

                      <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                        {job.title}
                      </h3>

                      {tags.length ? (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <span
                              key={`${job.id}-${tag}`}
                              className="rounded-[0.55rem] border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c2cde2]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {job.description ? (
                        <p className="max-w-3xl text-sm leading-7 text-[#b8c4d9]">{job.description}</p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between gap-5 md:flex-col md:items-end md:justify-center">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8390a8]">
                          Location
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-white md:justify-end">
                          <MapPin className="h-4 w-4 text-[#86a1e4]" />
                          {job.location}
                        </p>
                      </div>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 text-[#d4ddf2] transition duration-300 group-hover:scale-105 group-hover:bg-[#2a61dd] group-hover:text-white">
                        <ArrowUpRight className="h-4.5 w-4.5" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[1.2rem] border border-dashed border-white/12 bg-[#171b22] px-6 py-12 text-center">
              <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                No open positions yet
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#b3bfd5]">
                Add jobs from the dashboard and this section will update automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid w-full max-w-screen-xl gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
          <div>
            <h2 className="font-headline text-4xl font-black tracking-tight text-white sm:text-5xl">
              {career.applyTitle || "Apply with confidence"}
            </h2>
            <p className="mt-5 text-sm leading-8 text-[#bcc8de]">
              {career.applyDescription ||
                "Share your profile and role preference through our cleaner application flow. Hiring data remains connected with the existing backend process."}
            </p>

            <div className="mt-10 overflow-hidden rounded-[1.2rem] border border-white/8 bg-[linear-gradient(150deg,#2b5fd4,#1d47ab)] p-6 shadow-[0_24px_70px_rgba(2,7,22,0.35)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#dce6ff]">
                Selected Position
              </p>
              <h3 className="mt-2 font-headline text-3xl font-black tracking-tight text-white">
                {selectedJob?.title || "Position will appear here"}
              </h3>
              <p className="mt-2 text-sm text-[#e4ecff]">
                {selectedJob?.location || "Choose a role from the application form."}
              </p>

              <div className="mt-6 space-y-3">
                {reasons.length ? (
                  reasons.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-[#e8efff]">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#c5d6ff]" />
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-3 text-sm text-[#e8efff]">
                    <CheckCircle2 className="h-4.5 w-4.5 text-[#c5d6ff]" />
                    <span>Add career highlights from the dashboard to complete this section.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <JobApplicationForm
            jobs={jobs}
            showSelectedCard={false}
          />
        </div>
      </section>
    </main>
  );
}
