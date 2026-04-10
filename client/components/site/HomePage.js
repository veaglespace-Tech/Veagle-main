"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Code2,
  Database,
  Globe2,
  GraduationCap,
  Layers3,
  Megaphone,
  Rocket,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import { ctaShellClass } from "@/components/site/UiBits";
import { resolveClientProfile } from "@/lib/fallback-data";
import { COMPANY_BRAND_NAME } from "@/lib/site";
import { pageArtwork } from "@/lib/visuals";

const competenceIcons = [Globe2, ShoppingCart, Code2];
const whyIcons = [Sparkles, Database, Layers3, Megaphone];
const discoveryIcons = [Layers3, Database, GraduationCap];

function MarqueeRow({ items = [], showLabel = true }) {
  const values = items
    .map(resolveClientProfile)
    .filter((item) => item?.name);

  if (!values.length) {
    return (
      <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-10 text-center text-sm text-[#a5afc6]">
        Add client names or logos from the dashboard to populate this trust strip.
      </div>
    );
  }

  const loop = [...values, ...values];

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

function discoveryCards({ services, products, jobs }) {
  return [
    {
      key: "services",
      eyebrow: "Sector 01",
      title: "Services",
      description: `${services.length} active entries with cleaner discovery and direct enquiry flow.`,
      href: "/services",
      image: services[0]?.imageUrl || pageArtwork.services,
      icon: discoveryIcons[0],
    },
    {
      key: "products",
      eyebrow: "Sector 02",
      title: "Products",
      description: `${products.length} dashboard-managed product modules grouped for stronger presentation.`,
      href: "/products",
      image: products[0]?.imageUrl || "/veagle-art-suite.svg",
      icon: discoveryIcons[1],
    },
    {
      key: "career",
      eyebrow: "Sector 03",
      title: "Career & Univ.",
      description: `${jobs.length} role${jobs.length === 1 ? "" : "s"} plus practical learning tracks in one system.`,
      href: "/career",
      image: pageArtwork.university,
      icon: discoveryIcons[2],
    },
  ];
}

export default function HomePage({ content, services = [], products = [], jobs = [] }) {
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
  const systemsCards = discoveryCards({ services, products, jobs });
  const clientMarquee =
    Array.isArray(clients?.logos) && clients.logos.length ? clients.logos : [];
  const marqueeLabels =
    clientMarquee.length
      ? clientMarquee
      : Array.isArray(clients?.marquee) && clients.marquee.length
        ? clients.marquee
        : [];
  const clientProof =
    Array.isArray(clients?.proof) && clients.proof.length
      ? clients.proof.slice(0, 3)
      : [
          { label: "Connected logos", value: marqueeLabels.length ? `${marqueeLabels.length}+` : "0" },
          { label: "Live services", value: services.length ? `${services.length}` : "0" },
          { label: "Product modules", value: products.length ? `${products.length}` : "0" },
        ];

  return (
    <main className="overflow-hidden bg-[#131314] text-[#e4e2e2]">
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <div className="absolute inset-0">
          <Image
            src={pageArtwork.hero}
            alt="Veagle orbital operations background"
            fill
            className="object-cover opacity-35"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,14,24,0.45),rgba(9,11,16,0.9))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(25,94,226,0.2),transparent_35%),radial-gradient(circle_at_70%_30%,rgba(86,226,64,0.08),transparent_30%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-screen-xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[#1a1d24]/80 px-4 py-2 backdrop-blur-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[#56e240] shadow-[0_0_10px_rgba(86,226,64,0.55)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d6dcf0]">
              System Status: GO
            </span>
          </div>

          <h1 className="mx-auto mt-8 max-w-5xl font-headline text-4xl font-black leading-[0.94] tracking-[-0.045em] text-white sm:text-6xl lg:text-8xl">
            {hero.title || "We provide solutions for your"}{" "}
            <span className="text-glow bg-gradient-to-r from-[#e7ecff] via-[#bcd0ff] to-[#56e240] bg-clip-text text-transparent">
              {hero.highlight || "business!"}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#d3dbef] sm:text-lg">
            {hero.description ||
              `${COMPANY_BRAND_NAME} builds dynamic websites, software products, ERP systems and business-ready dashboard experiences.`}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={hero.primaryCtaHref || "/contact"}
              className="inline-flex items-center gap-2 rounded-full bg-[#b3c5ff] px-7 py-3.5 text-sm font-bold text-[#0c2d7a] transition hover:brightness-110"
            >
              {hero.primaryCtaLabel || "Get Started"}
            </Link>
            <Link
              href={hero.secondaryCtaHref || "/about"}
              className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-[#171b23]/70 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              {hero.secondaryCtaLabel || "View Process"}
              <Rocket className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div key={`${item.value}-${item.label}`} className="bg-[#151922]/80 px-5 py-7 text-left">
                <p className="font-headline text-3xl font-black tracking-tight text-[#c6d5ff]">
                  {item.value}
                </p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f97aa]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-3xl font-headline text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
              Cleaner service discovery without empty or overloaded sections
            </h2>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#b3c5ff] transition hover:gap-3"
            >
              Explore All Sectors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {systemsCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.key}
                  href={card.href}
                  className="group relative h-[420px] overflow-hidden rounded-[1.35rem] border border-white/8 bg-[#161922]"
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover opacity-32 transition duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,16,0.1),rgba(12,14,20,0.92))]" />
                  <div className="relative z-10 flex h-full flex-col justify-end p-6">
                    <div className="mb-4 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b3c5ff]">
                          {card.eyebrow}
                        </p>
                        <h3 className="mt-2 font-headline text-3xl font-black tracking-tight text-white">
                          {card.title}
                        </h3>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-[#b3c5ff]">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-[#c7cfe2]">{card.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#171a21] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-14 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9eb4ff]">
              Our Engineering Stack
            </p>
            <h2 className="mt-4 font-headline text-3xl font-black tracking-tight text-white sm:text-5xl">
              Core Competencies
            </h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            {competenceRows.map((item, index) => {
              const Icon = competenceIcons[index % competenceIcons.length];
              const title = item.title || item.label || `Competency 0${index + 1}`;
              const description = item.description || item.detail || "Designed for clean execution and long-term scale.";
              return (
                <article key={`${title}-${index}`} className="space-y-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-[#1f2533] text-[#9fb7ff]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-headline text-2xl font-black tracking-tight text-white">{title}</h3>
                  <p className="text-sm leading-8 text-[#c1cadf]">{description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-screen-2xl gap-4 lg:grid-cols-4">
          <div className="rounded-[1.4rem] border border-white/8 bg-[#242833] p-8 lg:col-span-2">
            <h2 className="font-headline text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
              Why mission leaders choose Veagle
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#c6cfe4]">
              We don&apos;t just build software; we architect reliable digital operations using delivery standards that keep teams aligned.
            </p>
          </div>

          {differentiators.map((item, index) => {
            const Icon = whyIcons[index % whyIcons.length];
            return (
              <article
                key={item.title}
                className="rounded-[1.35rem] border border-white/8 bg-[#1a1f28] p-6 transition hover:bg-[#1f2430]"
              >
                <Icon className="h-7 w-7 text-[#95adff]" />
                <h3 className="mt-5 font-headline text-xl font-black tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#bec8de]">{item.description}</p>
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

      <section className="relative overflow-hidden bg-[#10141b] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(25,94,226,0.16),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(86,226,64,0.08),transparent_20%)]" />
        <div className="relative mx-auto max-w-screen-2xl">
          <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9eb4ff]">
                Our Clients
              </p>
              <h2 className="mt-4 max-w-3xl font-headline text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                Trusted by businesses across finance, software and operations
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#c6cfe4]">
                {clients.description ||
                  `Client logos stay visible in one clean trust layer so visitors can quickly feel the range and credibility behind ${COMPANY_BRAND_NAME} delivery.`}
              </p>
              <Link
                href="/clients"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#b3c5ff] transition hover:gap-3"
              >
                Explore Client Network
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {clientProof.map((item) => (
                <div
                  key={`${item.label}-${item.value}`}
                  className="rounded-[1.5rem] border border-white/8 bg-[rgba(20,24,31,0.82)] px-5 py-6 shadow-[0_22px_60px_-42px_rgba(0,0,0,0.84)] backdrop-blur-[14px]"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8f9ab3]">
                    {item.label}
                  </p>
                  <p className="mt-3 font-headline text-2xl font-black tracking-tight text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/8 bg-[rgba(16,20,28,0.9)] p-4 shadow-[0_24px_70px_-44px_rgba(0,0,0,0.9)] backdrop-blur-[14px] sm:p-6">
            <MarqueeRow items={marqueeLabels} showLabel={false} />
          </div>
        </div>
      </section>

      <section className="bg-[#0f1217] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <h2 className="font-headline text-xl font-black uppercase tracking-[0.28em] text-[#9eb4ff]">
              The Flight Plan
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid gap-10 md:grid-cols-4">
            {process.map((step, index) => (
              <article key={step.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#9eb4ff]/40 bg-[#121722] font-headline text-lg font-black text-white">
                  0{index + 1}
                </div>
                <h3 className="mt-5 font-headline text-xl font-black tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#bec8de]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <h2 className="mb-12 text-center font-headline text-3xl font-black tracking-tight text-white sm:text-5xl">
            Dashboard Managed Solutions
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <article
                key={product.id || product.title}
                className="overflow-hidden rounded-[1.2rem] border border-white/8 bg-[#1a1f28] p-1"
              >
                <div className="relative h-56 overflow-hidden rounded-[0.95rem]">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                    {product.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#c1cbde]">
                    {product.description}
                  </p>
                  <Link
                    href="/products"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#9eb4ff]"
                  >
                    Review Module
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {!featuredProducts.length ? (
            <p className="mt-8 text-center text-sm text-[#a9b4cc]">
              Add products from dashboard and modules will appear here automatically.
            </p>
          ) : null}
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-screen-xl">
          <div
            className={`${ctaShellClass} relative overflow-hidden border border-white/10 bg-[linear-gradient(135deg,#a7bcff,#89a4ff)] px-6 py-12 text-center sm:px-8 lg:px-16`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(255,255,255,0.42),transparent_26%),radial-gradient(circle_at_86%_18%,rgba(255,255,255,0.28),transparent_20%)]" />
            <div className="relative z-10">
              <h2 className="mx-auto max-w-4xl font-headline text-3xl font-black leading-tight tracking-[-0.035em] text-[#1a2f73] sm:text-5xl">
                {finalCta.title || "Ready to build the next version of your website..."}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#233f8f]">
                {finalCta.description ||
                  "Tell us what needs to improve and we will convert it into a clear execution plan."}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href={finalCta.primaryHref || "/contact"}
                  className="inline-flex items-center rounded-full bg-[#203f96] px-7 py-3.5 text-sm font-bold text-white transition hover:brightness-110"
                >
                  {finalCta.primaryLabel || "Start a Project"}
                </Link>
                <Link
                  href={finalCta.secondaryHref || "/services"}
                  className="inline-flex items-center rounded-full border border-[#2f57bb]/35 bg-[#eff3ff] px-7 py-3.5 text-sm font-bold text-[#2047a9] transition hover:bg-white"
                >
                  {finalCta.secondaryLabel || "See the Workflow"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
