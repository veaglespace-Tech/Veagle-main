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
  "Industry-led sessions and practical guidance from working engineers.",
  "Weekly assignments that validate understanding and implementation quality.",
  "Project-based learning to build deployable portfolio-ready outputs.",
];

const fallbackCurriculumItems = [
  {
    title: "Java Fundamentals",
    description:
      "Core syntax, OOP principles and clean coding patterns for scalable systems.",
  },
  {
    title: "Backend APIs",
    description:
      "REST architecture, security and service integration for business applications.",
  },
  {
    title: "Databases",
    description:
      "Relational design, query optimization and data modeling for production workflows.",
  },
];

export const metadata = buildPageMetadata({
  title: "Java Full Stack Developer Program",
  description:
    "Explore Veagle University's Java Full Stack Developer program for practical, placement-aware learning and project-focused training.",
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
    "Practical training programs designed around real tools, real projects and career direction";
  const marker = "real tools";
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
      <span className="text-[#9db8ff]">{focus}</span>
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
      "Hands-on implementation with projects aligned to real delivery environments.",
  }));
}

function buildCareerCards(benefits) {
  return [
    {
      title: benefits[0]?.title || "Guidance Sessions",
      description:
        benefits[0]?.description ||
        "One-on-one mentorship sessions to map your skill growth and role direction.",
      icon: MessageSquareText,
      accent: "border-[#2d67eb]",
    },
    {
      title: benefits[1]?.title || "Interview Readiness",
      description:
        benefits[1]?.description ||
        "Mock interviews and preparation loops to improve confidence and outcomes.",
      icon: ClipboardCheck,
      accent: "border-[#56e240]",
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
    <main className="overflow-hidden bg-[#131314] text-[#e4e2e2]">
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
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2e4f8d]/45 bg-[#1b2440]/45 px-3 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#56e240]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b7cbff]">
                Mission Status: Active Enrollment
              </span>
            </div>

            <h1 className="mt-8 font-headline text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              {renderHeroTitle(university.title)}
            </h1>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#b3c5ff] px-7 py-3.5 text-sm font-bold text-[#133374] transition hover:brightness-110"
              >
                Enquire
              </Link>
              <Link
                href="/career"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#5f6c88]/45 bg-[#151a23]/58 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#1d2533]"
              >
                See Career Paths
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-headline text-3xl font-black tracking-tight text-white">
            {university.highlightTitle || "What learners get"}
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-[#2d67eb]" />

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            <article className="relative min-h-[300px] overflow-hidden rounded-[1rem] bg-[#1d2129] p-8 md:col-span-2">
              <p className="absolute left-7 top-5 font-headline text-6xl font-black text-white/[0.05]">01</p>
              <div className="relative z-10 pt-16">
                <Users2 className="h-8 w-8 text-[#7ea8ff]" />
                <h3 className="mt-5 font-headline text-2xl font-black tracking-tight text-white">
                  Industry-led sessions
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#b8c4dc]">{features[0]}</p>
              </div>
            </article>

            <article className="relative min-h-[300px] overflow-hidden rounded-[1rem] bg-[#1d2129] p-8">
              <p className="absolute left-7 top-5 font-headline text-6xl font-black text-white/[0.05]">02</p>
              <div className="relative z-10 pt-16">
                <ClipboardCheck className="h-8 w-8 text-[#56e240]" />
                <h3 className="mt-5 font-headline text-2xl font-black tracking-tight text-white">
                  Assignments
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#b8c4dc]">{features[1]}</p>
              </div>
            </article>

            <article className="grid overflow-hidden rounded-[1rem] border border-[#33549a]/30 bg-[#1a2438] md:col-span-3 md:grid-cols-[1.12fr_0.88fr]">
              <div className="relative p-8">
                <p className="absolute left-7 top-5 font-headline text-6xl font-black text-white/[0.07]">03</p>
                <div className="relative z-10 pt-16">
                  <TerminalSquare className="h-8 w-8 text-[#7ea8ff]" />
                  <h3 className="mt-5 font-headline text-2xl font-black tracking-tight text-white">
                    Project-based learning
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#cad6ee]">{features[2]}</p>
                </div>
              </div>
              <div className="m-6 overflow-hidden rounded-[0.8rem] border border-white/12 bg-[#0f131b]">
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

      <section className="bg-[#171b24] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-headline text-4xl font-black tracking-tight text-white sm:text-5xl">
              Curriculum Depth
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#bcc9df]">
              {university.highlightDescription ||
                "Master foundations and advanced architectures required for modern systems. Our curriculum maps practical delivery from basics to production-ready output."}
            </p>

            <ul className="mt-10 space-y-5">
              {curriculumItems.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#7ea8ff]" />
                  <div>
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-7 text-[#adbad2]">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-[#2d67eb]/25 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1rem] border border-white/15 bg-[#0f131a] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              <div className="flex items-center gap-3 border-b border-white/10 bg-[#151a22] px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8ea0c0]">
                  deployment_module_v4.7
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

              <div className="bg-[#0f131a]/95 p-7">
                <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                  Project Output
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#b4c2db]">
                  Build fully functional admin dashboards and full-stack applications that strengthen your portfolio credibility.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {chips.slice(0, 3).map((chip) => (
                    <span
                      key={chip}
                      className="rounded-[0.45rem] bg-[#2a303d] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9db8ff]"
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
          <Rocket className="mx-auto h-12 w-12 text-[#8caeff]" />
          <h2 className="mt-5 font-headline text-4xl font-black tracking-tight text-white sm:text-5xl">
            Your Career Orbit
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#b6c3da]">
            Our mission does not end at a certificate. We keep you equipped to navigate competitive roles with stronger confidence.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {careerCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className={`rounded-[1rem] border-l-4 bg-[#1f232b] p-7 text-left ${card.accent}`}
                >
                  <Icon className="h-6 w-6 text-[#8caeff]" />
                  <h3 className="mt-4 font-headline text-2xl font-black tracking-tight text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#b8c4dc]">{card.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

