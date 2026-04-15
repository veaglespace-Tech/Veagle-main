import Image from "next/image";
import { BriefcaseBusiness, Eye, Rocket, ShieldCheck } from "lucide-react";

import {
  PrimaryLink,
  SecondaryLink,
  SectionIntro,
  containerClass,
  ctaShellClass,
  firstSectionClass,
  pageClass,
  pageHeroTitleClass,
  sectionClass,
} from "@/components/site/UiBits";
import { cn } from "@/lib/utils";
import { pageArtwork } from "@/lib/visuals";

const principleIcons = [BriefcaseBusiness, Eye, ShieldCheck];

const defaultMilestones = [
  {
    label: "Projects",
    value: "Multi-Service",
    detail: "Website, software, ERP and digital support delivery handled through one coordinated process.",
  },
  {
    label: "Execution",
    value: "Practical First",
    detail: "Solutions are designed around clarity, usability and business-friendly maintenance.",
  },
  {
    label: "Support",
    value: "Long-Term",
    detail: "We keep improving structure, content and workflows after launch when teams need it.",
  },
];

const defaultWorkingModel = [
  "Understand the requirement, goals and current business gaps before writing a delivery plan.",
  "Design a clean structure for the website, software module or support workflow so it is easy to use.",
  "Build in small, testable steps with a focus on performance, clarity and maintainability.",
  "Review the live result, improve weak points and support teams as the system grows.",
];

const defaultPillars = [
  {
    title: "Clarity",
    description: "Every page, workflow and feature should be simple enough for real teams and clients to use confidently.",
  },
  {
    title: "Reliability",
    description: "We prefer stable, maintainable delivery over fragile visual tricks or hard-to-manage systems.",
  },
  {
    title: "Growth",
    description: "The work should support the next stage of the business, not just solve the problem of today.",
  },
];

export default function AboutPageContent({ content }) {
  const about = content?.about || {};
  const milestones =
    Array.isArray(about?.milestones) && about.milestones.length
      ? about.milestones.slice(0, 3)
      : defaultMilestones;
  const pillars =
    Array.isArray(about?.pillars) && about.pillars.length
      ? about.pillars.slice(0, 3)
      : defaultPillars;
  const workingModel =
    Array.isArray(about?.workingModel) && about.workingModel.length
      ? about.workingModel.slice(0, 4)
      : defaultWorkingModel;

  return (
    <main className={pageClass}>
      <section
        className={cn(
          "veagle-inverse-surface relative overflow-hidden bg-[#0c0e18] px-4 pb-20 sm:px-6 lg:px-8",
          firstSectionClass
        )}
      >
        <div className="absolute inset-0">
          <Image
            src={pageArtwork.hero}
            alt="About Veagle Space"
            fill
            className="object-cover opacity-35 brightness-[0.45]"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e18]/92 via-[#0c0e18]/58 to-[#0c0e18]" />
        </div>
        <div className="veagle-section-wash" />
        <div className="veagle-grid-background pointer-events-none opacity-40" />

        <div className={cn(containerClass, "relative z-10")}>
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-blue-100/70">
              About Veagle Space
            </div>
            <h1 className={cn("mx-auto mt-8 max-w-5xl text-white", pageHeroTitleClass)}>
              {about.title || "Engineering digital ecosystems with clean execution and practical outcomes"}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-blue-100/75 sm:text-lg">
              {about.description ||
                "We build websites, software systems, product modules and digital support workflows that stay clear, scalable and easier for teams to manage."}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <PrimaryLink href="/services">Explore Services</PrimaryLink>
              <SecondaryLink href="/contact" tone="inverse">
                Contact Us
              </SecondaryLink>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={containerClass}>
          <SectionIntro
            eyebrow="Milestones"
            title={about.story || "A delivery model built around useful software and clear communication"}
            description="Veagle Space was shaped for businesses that want fewer handoffs, clearer communication and one team that can move from planning into execution."
            align="center"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {milestones.map((item) => (
              <article
                key={`${item.label}-${item.value}`}
                className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-7 shadow-[color:var(--shadow-soft)] backdrop-blur-sm transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)]"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--accent)]">
                  {item.label}
                </p>
                <h3 className="mt-4 font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
                  {item.value}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[color:var(--border)] bg-[color:var(--page-bg-soft)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className={containerClass}>
          <div className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <SectionIntro
              eyebrow="How We Work"
              title="A practical process from first conversation to long-term support"
              description={
                about.background ||
                "Our process combines planning, design, development and improvement so each delivery stays practical, scalable and easier to manage over time."
              }
            />
            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[color:var(--shadow-soft)]">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--accent)]">
                Focus
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                We keep the process collaborative, reduce avoidable complexity and make each step clear enough for business teams to follow with confidence.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-12">
            {workingModel.map((step, index) => {
              const isFeatured = index === 1;
              const isWide = index === 0 || index === 3;

              return (
                <article
                  key={`working-model-${index + 1}`}
                  className={cn(
                    "relative overflow-hidden rounded-[1.5rem] border p-8 lg:p-10",
                    isFeatured
                      ? "veagle-inverse-surface border-transparent bg-[linear-gradient(135deg,#2563eb,#1a2a59)] shadow-[0_24px_70px_-40px_rgba(37,99,235,0.65)]"
                      : "border-[color:var(--border)] bg-[color:var(--surface)] shadow-[color:var(--shadow-soft)]",
                    isWide ? "md:col-span-7" : "md:col-span-5"
                  )}
                >
                  <p
                    className={cn(
                      "text-[11px] font-black uppercase tracking-[0.24em]",
                      isFeatured ? "text-white/65" : "text-[color:var(--accent)]"
                    )}
                  >
                    Step {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className={cn(
                      "mt-4 font-headline text-2xl font-black tracking-tight sm:text-3xl",
                      isFeatured ? "text-[color:var(--text-primary)]" : "text-[color:var(--text-primary)]"
                    )}
                  >
                    {index === 0 && "Discover and plan"}
                    {index === 1 && "Design with clarity"}
                    {index === 2 && "Build with structure"}
                    {index === 3 && "Refine and support"}
                  </h3>
                  <p className="relative z-10 mt-4 text-sm leading-8 text-[color:var(--text-secondary)] sm:text-base">
                    {step}
                  </p>
                  {index === workingModel.length - 1 ? (
                    <div className="pointer-events-none absolute -bottom-6 right-2 opacity-[0.14]">
                      <Rocket className="h-32 w-32 text-[color:var(--text-primary)] lg:h-40 lg:w-40" />
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={containerClass}>
          <SectionIntro
            eyebrow="Core Principles"
            title="The standards behind every website, software and support engagement"
            description="These principles shape how we decide what to build, how we build it and how we support it after launch."
            align="center"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar, index) => {
              const Icon = principleIcons[index % principleIcons.length];

              return (
                <article
                  key={pillar.title}
                  className="flex h-full flex-col items-center rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-8 text-center shadow-[color:var(--shadow-soft)] transition hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)]"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--accent)]/12 text-[color:var(--accent)]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-sm leading-8 text-[color:var(--text-secondary)]">
                    {pillar.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div
          className={cn(
            "veagle-inverse-surface mx-auto max-w-6xl border border-white/10 bg-[linear-gradient(135deg,#182a59,#101a33)] shadow-[0_30px_90px_-44px_rgba(6,12,28,0.72)]",
            ctaShellClass
          )}
        >
          <div className="relative px-6 py-14 text-center sm:px-10 lg:px-14 lg:py-16">
            <div className="absolute inset-0 opacity-[0.12]">
              <Image
                src={pageArtwork.hero}
                alt="CTA texture"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="relative z-10">
              <h2 className="font-headline text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {about.ctaTitle || "Plan your next digital milestone with confidence"}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-white/80 sm:text-lg">
                {about.ctaDescription ||
                  "From websites and dashboards to software systems and SEO-ready content, we help businesses move from idea to execution with clarity."}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <PrimaryLink href="/contact" tone="inverse">
                  Start a Conversation
                </PrimaryLink>
                <SecondaryLink href="/services" tone="solid-inverse">
                  View Services
                </SecondaryLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
