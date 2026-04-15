"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Database,
  Globe2,
  Layers3,
  Megaphone,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import {
  PrimaryLink,
  SecondaryLink,
  ctaShellClass,
  pageClass,
  pageHeroTitleClass,
} from "@/components/site/UiBits";
import { resolveClientProfile } from "@/lib/fallback-data";
import { backendAssetUrl } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { pageArtwork, resolveServiceIllustration } from "@/lib/visuals";

const competenceIcons = [Globe2, ShoppingCart, Code2];
const whyIcons = [Sparkles, Database, Layers3, Megaphone];
const showcaseIcons = [Code2, Layers3, BriefcaseBusiness, Globe2];

function MarqueeRow({ items = [], showLabel = true }) {
  const values = items
    .map(resolveClientProfile)
    .filter((item) => item?.name);

  if (!values.length) {
    return (
      <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-[color:var(--text-muted)]">
        Add client names or logos from the dashboard to populate this trust strip.
      </div>
    );
  }

  const loop = values;

  return (
    <div className="veagle-marquee">
      <div className="veagle-marquee-track">
        {loop.map((item, index) => {
          const displayLabel = showLabel || !item.image;
          const content = (
            <>
              {item.image ? (
                <span className="veagle-marquee-logo-wrap">
                  <Image
                    src={item.image}
                    alt={`${item.name} logo`}
                    width={40}
                    height={40}
                    className="veagle-marquee-logo"
                    unoptimized
                  />
                </span>
              ) : null}
              {displayLabel ? <span className="veagle-marquee-label">{item.name}</span> : null}
            </>
          );

          if (item.href) {
            return (
              <a
                key={`${item.name}-${index}`}
                className={`veagle-marquee-item ${item.image ? "has-logo" : ""} ${showLabel ? "" : "logo-only"}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                title={`Open ${item.name}`}
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={`${item.name}-${index}`}
              className={`veagle-marquee-item ${item.image ? "has-logo" : ""} ${showLabel ? "" : "logo-only"}`}
              title={item.name}
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function createShowcaseItems({ services, products, jobs, clientProof, clientCount }) {
  const serviceImage = services[0]?.imageUrl || resolveServiceIllustration(services[0]?.title);
  const productImage = products[0]?.imageUrl || "/Digital Products.png";
  const featuredServices = services.length
    ? services.slice(0, 3).map((item) => item.title)
    : ["Website delivery", "Software modules", "Growth support"];
  const featuredProducts = products.length
    ? products.slice(0, 3).map((item) => item.title)
    : ["Operational dashboards", "Digital products", "Business-ready systems"];
  const featuredRoles = jobs.length
    ? jobs.slice(0, 3).map((item) => item.title)
    : ["Practical project exposure", "Collaborative learning", "Real delivery cycles"];
  const clientSignals = clientProof.length
    ? clientProof.map((item) => `${item.value} ${item.label}`)
    : ["Execution-first workflows", "Business-facing delivery", "Multi-service support"];

  return [
    {
      key: "services",
      eyebrow: "Start with delivery",
      title: "Services",
      description: "Choose the right stream for websites, software delivery and digital growth support.",
      href: "/services",
      image: serviceImage,
      icon: showcaseIcons[0],
      previewTitle: "Clarify the work before you commit to it",
      previewDescription:
        "Review service categories built for real business outcomes, from redesigns and software workflows to SEO-ready execution support.",
      stats: [
        { label: "Service lines", value: services.length ? `${services.length}+` : "Core" },
        { label: "Best fit", value: "Web + software" },
      ],
      highlights: featuredServices,
      ctaLabel: "Explore Services",
    },
    {
      key: "products",
      eyebrow: "Move faster with modules",
      title: "Products",
      description: "Browse packaged solutions that help teams launch systems with less guesswork.",
      href: "/products",
      image: productImage,
      icon: showcaseIcons[1],
      previewTitle: "See packaged solutions before planning custom work",
      previewDescription:
        "Compare product modules, understand their direction and identify where a ready-made solution can shorten delivery time.",
      stats: [
        { label: "Product modules", value: products.length ? `${products.length}+` : "Growing" },
        { label: "Best fit", value: "Faster launches" },
      ],
      highlights: featuredProducts,
      ctaLabel: "Browse Products",
    },
    {
      key: "career",
      eyebrow: "Join the build team",
      title: "Career",
      description: "Preview how the team works and what kind of practical roles we open when hiring.",
      href: "/career",
      image: pageArtwork.career,
      icon: showcaseIcons[2],
      previewTitle: "A hands-on environment built around practical delivery",
      previewDescription:
        "Candidates get visibility into live execution, clear communication and the kind of work that improves both user experience and business clarity.",
      stats: [
        { label: "Open roles", value: jobs.length ? `${jobs.length}` : "Soon" },
        { label: "Focus", value: "Learn by shipping" },
      ],
      highlights: featuredRoles,
      ctaLabel: "View Careers",
    },
    {
      key: "clients",
      eyebrow: "Review trust and fit",
      title: "Clients",
      description: "Understand the kinds of organizations, industries and delivery needs we support.",
      href: "/clients",
      image: pageArtwork.about,
      icon: showcaseIcons[3],
      previewTitle: "Proof, industries and delivery context in one place",
      previewDescription:
        "Explore client signals, delivery strengths and the kind of organizations that benefit from one team handling execution end to end.",
      stats: [
        { label: "Client signals", value: clientCount ? `${clientCount}+` : "Growing" },
        { label: "Coverage", value: "Multi-industry" },
      ],
      highlights: clientSignals,
      ctaLabel: "See Client Work",
    },
  ];
}

function normalizeBackendClients(items = []) {
  return items
    .map((client) => ({
      name: client?.name || "",
      href: client?.websiteUrl || "/contact",
      image: backendAssetUrl(client?.logoUrl),
    }))
    .filter((item) => item.name);
}

export default function HomePage({ content, services = [], products = [], jobs = [], clientsData = [] }) {
  const hero = content?.hero || {};
  const finalCta = content?.finalCta || {};
  const clients = content?.clients || {};
  const stats = Array.isArray(content?.stats) ? content.stats.slice(0, 4) : [];
  const process = Array.isArray(content?.process) ? content.process.slice(0, 4) : [];
  const differentiators = Array.isArray(content?.differentiators)
    ? content.differentiators.slice(0, 4)
    : [];
  const featuredServices = services.slice(0, 3);
  const featuredProducts = products.slice(0, 3);
  const competenceRows = featuredServices.length ? featuredServices : differentiators.slice(0, 3);

  /* --- Build marquee from backend clients FIRST, fallback to CMS --- */
  const backendClients = normalizeBackendClients(Array.isArray(clientsData) ? clientsData : []);
  const cmsLogos = Array.isArray(clients?.logos) && clients.logos.length ? clients.logos : [];
  const cmsMarquee = Array.isArray(clients?.marquee) && clients.marquee.length ? clients.marquee : [];
  const marqueeLabels = backendClients.length
    ? backendClients
    : cmsLogos.length
      ? cmsLogos
      : cmsMarquee;

  const clientProof =
    Array.isArray(clients?.proof) && clients.proof.length
      ? clients.proof.slice(0, 3)
      : [
          { label: "Connected logos", value: marqueeLabels.length ? `${marqueeLabels.length}+` : "0" },
          { label: "Live services", value: services.length ? `${services.length}` : "0" },
          { label: "Product modules", value: products.length ? `${products.length}` : "0" },
        ];
  const showcaseItems = createShowcaseItems({
    services,
    products,
    jobs,
    clientProof,
    clientCount: marqueeLabels.length,
  });
  const [activeShowcaseKey, setActiveShowcaseKey] = useState(showcaseItems[0].key);
  const activeShowcase =
    showcaseItems.find((item) => item.key === activeShowcaseKey) || showcaseItems[0];

  return (
    <main className={pageClass}>
      {/* Hero Section - Permanently Dark */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden bg-[#0c0e18] px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <div className="absolute inset-0">
          <Image
            src={pageArtwork.hero}
            alt="Veagle Space homepage background"
            fill
            className="object-cover opacity-50 brightness-[0.4]"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e18]/90 via-[#0c0e18]/40 to-[#0c0e18]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0c0e18_100%)] opacity-80" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-screen-xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-100/70">
              {hero.label || "Execution-led partner for websites, software and growth systems"}
            </span>
          </div>

          <h1 className={`mx-auto mt-8 max-w-5xl ${pageHeroTitleClass} text-white`}>
            {hero.title || "Websites, software systems and content-ready digital operations"}{" "}
            <br className="hidden lg:block" />
            <span className="text-glow bg-gradient-to-r from-[#2563eb] to-[#10b981] bg-clip-text text-transparent">
              {hero.highlight || "designed to move businesses forward with less friction"}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-[1.1rem] leading-8 text-blue-100/60">
            {hero.description ||
              "We help teams redesign websites, launch portals, organize product content and support digital growth without splitting strategy from delivery."}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <PrimaryLink href={hero.primaryCtaHref || "/contact"}>
                {hero.primaryCtaLabel || "Get Started"}
              </PrimaryLink>
              <SecondaryLink href={hero.secondaryCtaHref || "/about"} className="border-white/10 text-white hover:bg-white/5">
                {hero.secondaryCtaLabel || "View Process"}
              </SecondaryLink>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4 shadow-2xl">
            {stats.map((item) => (
              <div key={`${item.value}-${item.label}`} className="bg-[#0c0e18]/80 backdrop-blur-md px-6 py-9 text-center transition-all duration-300 hover:bg-[#1a2a59]">
                <p className="font-headline text-4xl font-black tracking-tight text-white mb-2">
                  {item.value}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-100/50">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="grid gap-8 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[color:var(--accent)]">
                Interactive Explorer
              </p>
              <h2 className="mt-4 max-w-4xl font-headline text-4xl font-black leading-[1.02] tracking-[-0.03em] text-[color:var(--text-primary)] sm:text-6xl">
                Find the right starting point for your next digital milestone
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--text-secondary)]">
                Switch between services, products, careers and client proof to understand where Veagle Space can help first.
              </p>

              <div className="mt-8 grid gap-3">
                {showcaseItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.key === activeShowcase.key;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => startTransition(() => setActiveShowcaseKey(item.key))}
                      className={cn(
                        "group rounded-[1.45rem] border p-5 text-left transition-all duration-300",
                        isActive
                          ? "border-[color:var(--accent)]/30 bg-[color:var(--surface-strong)] shadow-[0_22px_60px_-46px_rgba(25,94,226,0.55)]"
                          : "border-[color:var(--border)] bg-[color:var(--surface)] hover:-translate-y-1 hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)]"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
                            isActive
                              ? "bg-[color:var(--accent)] text-white"
                              : "bg-[color:var(--surface-strong)] text-[color:var(--accent)]"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                                {item.eyebrow}
                              </p>
                              <h3 className="mt-2 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                                {item.title}
                              </h3>
                            </div>
                            <ArrowRight
                              className={cn(
                                "mt-1 h-4 w-4 shrink-0 transition-transform duration-300",
                                isActive
                                  ? "translate-x-1 text-[color:var(--accent)]"
                                  : "text-[color:var(--text-muted)] group-hover:translate-x-1"
                              )}
                            />
                          </div>
                          <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative min-h-[560px] overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#0c0e18] shadow-[0_28px_80px_-44px_rgba(10,14,24,0.75)]">
              <Image
                key={activeShowcase.key}
                src={activeShowcase.image}
                alt={activeShowcase.title}
                fill
                className="object-cover opacity-55 transition duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,24,0.16),rgba(7,12,24,0.9))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(37,99,235,0.32),transparent_25%)]" />

              <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
                <div className="grid gap-3 sm:max-w-[22rem] sm:grid-cols-2">
                  {activeShowcase.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[1.15rem] border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                        {stat.label}
                      </p>
                      <p className="mt-2 font-headline text-2xl font-black tracking-tight text-white">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/68">
                    {activeShowcase.eyebrow}
                  </p>
                  <h3 className="mt-3 max-w-2xl font-headline text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                    {activeShowcase.previewTitle}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-white/82 sm:text-base">
                    {activeShowcase.previewDescription}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {activeShowcase.highlights.map((point) => (
                      <div
                        key={point}
                        className="rounded-[1.1rem] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-6 text-white/84 backdrop-blur-sm"
                      >
                        {point}
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <PrimaryLink href={activeShowcase.href} tone="inverse">
                      {activeShowcase.ctaLabel}
                    </PrimaryLink>
                    <SecondaryLink href="/contact" tone="inverse">
                      Start a Conversation
                    </SecondaryLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--page-bg-soft)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24 border-y border-[color:var(--border)]">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-14 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[color:var(--accent)]">
              What We Help With
            </p>
            <h2 className="mt-4 font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-5xl">
              Core Service Strengths
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {competenceRows.map((item, index) => {
              const Icon = competenceIcons[index % competenceIcons.length];
              const title = item.title || item.label || `Competency 0${index + 1}`;
              const description =
                item.description ||
                item.detail ||
                "Planned to support usability, business clarity and long-term scalability.";
              return (
                <article key={`${title}-${index}`} className="flex flex-col items-center text-center space-y-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--accent)] shadow-xl">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">{title}</h3>
                    <p className="line-clamp-3 text-sm leading-8 text-[color:var(--text-secondary)]">{description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-screen-2xl gap-4 lg:grid-cols-4">
            <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-8 lg:col-span-2">
              <h2 className="font-headline text-3xl font-black leading-tight tracking-[-0.03em] text-[color:var(--text-primary)] sm:text-5xl">
                Why businesses choose Veagle Space
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--text-secondary)]">
                We combine website strategy, software execution and content clarity so your brand looks stronger online and your internal workflows stay easier to manage.
              </p>
            </div>

          {differentiators.map((item, index) => {
            const Icon = whyIcons[index % whyIcons.length];
            return (
              <article
                key={item.title}
                className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 transition hover:bg-[color:var(--surface-strong)] hover:-translate-y-1 duration-300 shadow-[color:var(--shadow-soft)]"
              >
                <Icon className="h-7 w-7 text-[color:var(--accent)]" />
                <h3 className="mt-5 font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">{item.description}</p>
              </article>
            );
          })}

          <div className="overflow-hidden rounded-[1.4rem] lg:col-span-2">
            <Image
              src={pageArtwork.services}
              alt="Engineering systems"
              width={1400}
              height={900}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[color:var(--page-bg)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24 border-t border-[color:var(--border)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(37,99,235,0.08),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(16,185,129,0.04),transparent_20%)]" />
        <div className="relative mx-auto max-w-screen-2xl">
          <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[color:var(--accent)]">
                Trust and Delivery
              </p>
              <h2 className="mt-4 max-w-3xl font-headline text-3xl font-black leading-tight tracking-[-0.03em] text-[color:var(--text-primary)] sm:text-5xl">
                Built to support service brands, operations teams and digital-first businesses
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--text-secondary)]">
                {clients.description ||
                  `Our delivery model is designed for businesses that need a reliable partner for websites, software systems and digital growth support.`}
              </p>
              <Link
                href="/clients"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--accent)] transition hover:gap-3"
              >
                Explore Industries
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {clientProof.map((item) => (
                <div
                  key={`${item.label}-${item.value}`}
                  className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-5 py-6 shadow-[color:var(--shadow-soft)] backdrop-blur-[14px]"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-3 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-strong)]/80 p-4 shadow-[color:var(--shadow-card)] backdrop-blur-[14px] sm:p-6">
            <MarqueeRow items={marqueeLabels} showLabel={false} />
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--page-bg)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24 border-t border-[color:var(--border)]">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-[color:var(--border)]" />
            <h2 className="font-headline text-xl font-black uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
              Our Process
            </h2>
            <div className="h-px flex-1 bg-[color:var(--border)]" />
          </div>
          <div className="grid gap-10 md:grid-cols-4">
            {process.map((step, index) => (
              <article key={step.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--accent)] bg-[color:var(--surface)] font-headline text-lg font-black text-[color:var(--accent)] shadow-lg transition-transform hover:scale-110 duration-300">
                  0{index + 1}
                </div>
                <h3 className="mt-5 font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24 border-t border-[color:var(--border)]">
        <div className="mx-auto max-w-screen-2xl">
          <h2 className="mb-12 text-center font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-5xl">
            Featured Products and Solutions
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <article
                key={product.id || product.title}
                className="group veagle-premium-card flex h-full flex-col overflow-hidden rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-1 transition duration-300"
              >
                <div className="relative h-56 shrink-0 overflow-hidden rounded-[0.95rem]">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
                    {product.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                    {product.description}
                  </p>
                  <Link
                    href="/products"
                    className="mt-auto inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--accent)] pb-2 transition hover:gap-3"
                  >
                    View Details
                    <ArrowRight className="veagle-icon-animate h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {!featuredProducts.length ? (
            <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)]">
              Add products from the dashboard to show your latest solutions here.
            </p>
          ) : null}
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl">
          <div
            className={`${ctaShellClass} relative overflow-hidden border border-white/10 bg-[linear-gradient(135deg,#182a59,#101a33)] px-6 py-12 text-center shadow-[0_30px_90px_-44px_rgba(6,12,28,0.72)] sm:px-8 lg:px-16`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(179,197,255,0.24),transparent_26%),radial-gradient(circle_at_86%_18%,rgba(86,226,64,0.12),transparent_20%)]" />
            <div className="relative z-10">
              <h2 className="mx-auto max-w-4xl font-headline text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-5xl">
                {finalCta.title || "Build the next version of your digital operation with one execution-focused team"}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-white/80">
                {finalCta.description ||
                  "If you need a website redesign, portal, software platform or growth-ready content system, we can help you move faster with clearer execution."}
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
                <PrimaryLink href={finalCta.primaryHref || "/contact"} tone="inverse">
                  {finalCta.primaryLabel || "Start a Project"}
                </PrimaryLink>
                <SecondaryLink href={finalCta.secondaryHref || "/services"} tone="inverse">
                  {finalCta.secondaryLabel || "View Services"}
                </SecondaryLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
