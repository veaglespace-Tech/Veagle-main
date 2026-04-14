import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  MessageSquareText,
  Rocket,
  TerminalSquare,
  Users2,
} from "lucide-react";

import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { pageArtwork } from "@/lib/visuals";

const defaultFeatures = [
  "Industry-led technical protocols and practical mentorship from senior engineering leads.",
  "Periodic architectural assessments that validate core implementation and system quality.",
  "Project-centric learning cycles designed to produce high-impact, production-ready portfolios.",
];

const fallbackCurriculumItems = [
  {
    title: "Java Infrastructure Nodes",
    description:
      "Master core syntax, reactive paradigms, and SOLID principles for high-availability enterprise systems.",
  },
  {
    title: "Backend API Orchestration",
    description:
      "Developing secure RESTful modules, microservices authentication, and complex relational integrations.",
  },
  {
    title: "Data Persistence Layers",
    description:
      "Advanced RDBMS design, query performance tuning, and scalable data modeling for global operations.",
  },
];

export const metadata = buildPageMetadata({
  title: "Java Full Stack Developer Program",
  description:
    "Explore Veagle University's Java Full Stack Developer program for high-performance engineering mentorship and project-centric technical training.",
  path: "/university/java-full-stack",
  keywords: [
    "Java full stack course Pune",
    "Veagle University",
    "developer training program",
    "full stack developer course",
  ],
});

function renderHeroTitle(value) {
  const title =
    value ||
    "High-performance engineering programs architected for senior level readiness and technical mastery";
  const marker = "technical mastery";
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

function pickFeatures(source) {
  const values = Array.isArray(source) ? source.filter(Boolean) : [];
  const merged = [...values, ...defaultFeatures];
  return merged.slice(0, 3);
}

function buildCurriculumItems(chips, benefits) {
  const selected = Array.isArray(chips) ? chips.filter(Boolean).slice(0, 3) : [];

  if (!selected.length) {
    return fallbackCurriculumItems;
  }

  return selected.map((title, index) => ({
    title,
    description:
      benefits[index]?.description ||
      fallbackCurriculumItems[index]?.description ||
      "Executing complex software implementations within simulated enterprise delivery environments.",
  }));
}

function buildCareerCards(benefits) {
  return [
    {
      title: benefits[0]?.title || "Strategic Mentorship",
      description:
        benefits[0]?.description ||
        "Direct uplink with engineering leads to map your technical evolution and professional trajectory.",
      icon: MessageSquareText,
      accent: "border-[color:var(--accent)]",
    },
    {
      title: benefits[1]?.title || "Operational Readiness",
      description:
        benefits[1]?.description ||
        "Simulated assessment protocols and interview loops to optimize candidate conversion and confidence.",
      icon: ClipboardCheck,
      accent: "border-[color:var(--accent-success)]",
    },
  ];
}

export default async function JavaFullStackPage() {
  const content = await getSiteContent();
  const university = content?.university || {};
  const chips = Array.isArray(university?.chips) ? university.chips : [];
  const benefits = Array.isArray(university?.benefits) ? university.benefits : [];
  const features = pickFeatures(university?.features);
  const curriculumItems = buildCurriculumItems(chips, benefits);
  const careerCards = buildCareerCards(benefits);

  return (
    <main className="overflow-hidden bg-[color:var(--page-bg)] text-[color:var(--text-secondary)]">
      <section className="relative flex min-h-[78vh] items-center overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="absolute inset-0">
          <Image
            src={pageArtwork.hero}
            alt="University hero background"
            fill
            priority
            className="object-cover opacity-45"
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,12,20,0.96),rgba(8,12,20,0.75)_52%,rgba(8,12,20,0.45))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(41,111,255,0.24),transparent_35%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--surface-strong)] px-3 py-1.5 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--accent-success)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                Program Orbit: Enrollment Priority
              </span>
            </div>

            <h1 className="mt-8 font-headline text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              {renderHeroTitle(university.title)}
            </h1>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-7 py-3.5 text-sm font-black text-white transition hover:brightness-110 shadow-[0_4px_24px_rgba(25,94,226,0.3)]"
              >
                Initiate Enquiry
              </Link>
              <Link
                href="/career"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[color:var(--surface-strong)] px-7 py-3.5 text-sm font-black text-white transition hover:bg-white/10"
              >
                Explore Career Nodes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
            {university.highlightTitle || "Core Delivery Modules"}
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-[color:var(--accent)]" />

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            <article className="relative min-h-[300px] overflow-hidden rounded-[1rem] bg-[color:var(--surface)] p-8 md:col-span-2 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.8)]">
              <p className="absolute left-7 top-5 font-headline text-6xl font-black text-white/[0.05]">
                01
              </p>
              <div className="relative z-10 pt-16">
                <Users2 className="h-8 w-8 text-[color:var(--accent)]" />
                <h3 className="mt-5 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                  Lead Mentorship Nodes
                </h3>
                <p className="mt-4 max-w-xl text-[15px] leading-7 text-[color:var(--text-secondary)]">{features[0]}</p>
              </div>
            </article>

            <article className="relative min-h-[300px] overflow-hidden rounded-[1rem] bg-[color:var(--surface)] p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.8)]">
              <p className="absolute left-7 top-5 font-headline text-6xl font-black text-white/[0.05]">
                02
              </p>
              <div className="relative z-10 pt-16">
                <ClipboardCheck className="h-8 w-8 text-[color:var(--accent-success)]" />
                <h3 className="mt-5 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                  Validation Protocols
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-[color:var(--text-secondary)]">{features[1]}</p>
              </div>
            </article>

            <article className="grid overflow-hidden rounded-[1rem] border border-[color:var(--accent)]/10 bg-[color:var(--surface-strong)] md:col-span-3 md:grid-cols-[1.12fr_0.88fr] shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)]">
              <div className="relative p-8">
                <p className="absolute left-7 top-5 font-headline text-6xl font-black text-white/[0.07]">
                  03
                </p>
                <div className="relative z-10 pt-16">
                  <TerminalSquare className="h-8 w-8 text-[color:var(--accent)]" />
                  <h3 className="mt-5 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                    Project Architecture Lab
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">{features[2]}</p>
                </div>
              </div>
              <div className="m-6 overflow-hidden rounded-[0.8rem] border border-white/12 bg-[color:var(--page-bg)]">
                <Image
                  src={pageArtwork.services}
                  alt="Project lab environment"
                  width={1000}
                  height={680}
                  className="h-full w-full object-cover opacity-70"
                  unoptimized
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--page-bg-soft)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-headline text-4xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-5xl">
              Curriculum Architecture
            </h2>
            <p className="mt-7 max-w-2xl text-[16px] leading-8 text-[color:var(--text-secondary)]">
              {university.highlightDescription ||
                "Synthesizing theoretical foundations with complex architectural patterns. Our program tracks mission-critical delivery from foundational syntax to multi-tier enterprise ecosystems."}
            </p>

            <ul className="mt-10 space-y-5">
              {curriculumItems.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[color:var(--accent)]" />
                  <div>
                    <p className="text-base font-black text-[color:var(--text-primary)]">{item.title}</p>
                    <p className="mt-1 text-sm leading-7 text-[color:var(--text-muted)]">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-[color:var(--accent)]/15 blur-3xl opacity-50" />
            <div className="relative overflow-hidden rounded-[1rem] border border-white/10 bg-[color:var(--page-bg)] shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-3 border-b border-white/10 bg-[color:var(--surface-strong)] px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-400/50" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/50" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/50" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                  deployment_module_v6.4
                </p>
              </div>

              <div className="p-2">
                <Image
                  src={pageArtwork.university}
                  alt="Curriculum lab"
                  width={1200}
                  height={900}
                  className="h-full w-full rounded-[0.7rem] object-cover"
                  unoptimized
                />
              </div>

              <div className="bg-[color:var(--page-bg)]/95 p-7">
                <h3 className="font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                  Production Protoccol
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                  Engineer fully integrated enterprise modules and full-stack solutions that establish high-level architectural credibility.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {chips.slice(0, 3).map((chip) => (
                    <span
                      key={chip}
                      className="rounded-[0.45rem] bg-[color:var(--surface-strong)] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-[color:var(--accent)]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="mx-auto max-w-7xl text-center">
          <Rocket className="mx-auto h-12 w-12 text-[color:var(--accent)]" />
          <h2 className="mt-5 font-headline text-4xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-5xl">
            Career Trajectory Orbit
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[color:var(--text-secondary)]">
            Our engagement extends beyond technical instruction. We architect the necessary professional orbits to ensure mission-ready status in high-tier engineering environments.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {careerCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className={`rounded-[1rem] border-l-4 bg-[color:var(--surface)] p-7 text-left transition duration-300 hover:scale-[1.02] hover:bg-[color:var(--surface-strong)] ${card.accent}`}
                >
                  <Icon className="h-6 w-6 text-[color:var(--accent)]" />
                  <h3 className="mt-4 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{card.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
