"use client";

import Image from "next/image";
import Link from "next/link";
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
import { pageArtwork, resolveServiceIllustration } from "@/lib/visuals";

const competenceIcons = [Globe2, ShoppingCart, Code2];
const whyIcons = [Sparkles, Database, Layers3, Megaphone];
const discoveryIcons = [Layers3, Database, BriefcaseBusiness];

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
  const serviceImage = services[0]?.imageUrl || resolveServiceIllustration(services[0]?.title);
  const productImage = products[0]?.imageUrl || "/Digital Products.png";
  return [
    {
      key: "services",
      eyebrow: "Sector 01",
      title: "Services",
      description: `${services.length} service pages designed to explain offerings clearly and convert interest into inquiries.`,
      href: "/services",
      image: serviceImage,
      icon: discoveryIcons[0],
    },
    {
      key: "products",
      eyebrow: "Sector 02",
      title: "Products",
      description: `${products.length} product and solution modules grouped to make business offerings easier to browse.`,
      href: "/products",
      image: productImage,
      icon: discoveryIcons[1],
    },
    {
      key: "career",
      eyebrow: "Sector 03",
      title: "Career",
      description: `${jobs.length} open role${jobs.length === 1 ? "" : "s"} across development, design and business growth teams.`,
      href: "/career",
      image: pageArtwork.career,
      icon: discoveryIcons[2],
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
  const systemsCards = discoveryCards({ services, products, jobs });

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

  return (
    <main className={pageClass}>
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <div className="absolute inset-0">
            <Image
              src={pageArtwork.hero}
              alt="Veagle Space homepage background"
            fill
            className="object-cover opacity-35"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,14,24,0.45),rgba(9,11,16,0.9))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(25,94,226,0.2),transparent_35%),radial-gradient(circle_at_70%_30%,rgba(86,226,64,0.08),transparent_30%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-screen-xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[color:var(--surface-strong)] px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-[#8ba8ff] shadow-[0_0_10px_rgba(139,168,255,0.4)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[color:var(--text-secondary)]">
              {hero.label || "Dynamic websites, software and SEO services"}
            </span>
          </div>

          <h1 className={`mx-auto mt-8 max-w-5xl ${pageHeroTitleClass} text-white`}>
            {hero.title || "Website development, software, ERP, digital marketing"} <br className="hidden lg:block" />
            <span className="text-glow bg-gradient-to-r from-[#e7ecff] via-[#bcd0ff] to-[#56e240] bg-clip-text text-transparent">
              {hero.highlight || "and business support services in one place"}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-[1.1rem] leading-8 text-[color:var(--text-secondary)]">
            {hero.description ||
              "Engineering high-performance software ecosystems, dynamic web presence, and scalable ERP frameworks with precision technical execution."}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
            <PrimaryLink href={hero.primaryCtaHref || "/contact"}>
              {hero.primaryCtaLabel || "Get Started"}
            </PrimaryLink>
            <SecondaryLink href={hero.secondaryCtaHref || "/about"}>
              {hero.secondaryCtaLabel || "View Process"}
            </SecondaryLink>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4 shadow-2xl">
            {stats.map((item) => (
              <div key={`${item.value}-${item.label}`} className="bg-[#0f1219]/95 px-6 py-9 text-center transition-all duration-300 hover:bg-[#141a26]">
                <p className="font-headline text-4xl font-black tracking-tight text-white mb-2">
                  {item.value}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-4xl font-headline text-4xl font-black leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl">
              Explore website, software, product and career sections
            </h2>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--accent-soft)] transition hover:gap-3"
            >
              Explore All Services
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
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--accent-soft)]">
                          {card.eyebrow}
                        </p>
                        <h3 className="mt-2 font-headline text-3xl font-black tracking-tight text-white">
                          {card.title}
                        </h3>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-[color:var(--accent-soft)]">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-sm leading-7 text-[color:var(--text-secondary)]">{card.description}</p>
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
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
              What We Help With
            </p>
            <h2 className="mt-4 font-headline text-3xl font-black tracking-tight text-white sm:text-5xl">
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
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.2rem] border border-white/12 bg-white/5 text-[color:var(--accent-soft)] shadow-xl">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-headline text-2xl font-black tracking-tight text-white">{title}</h3>
                    <p className="text-sm leading-8 text-white/70">{description}</p>
                  </div>
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
                className="rounded-[1.35rem] border border-white/8 bg-[#1a1f28] p-6 transition hover:bg-[#1f2430]"
              >
                <Icon className="h-7 w-7 text-[#95adff]" />
                <h3 className="mt-5 font-headline text-xl font-black tracking-tight text-white">
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

      <section className="relative overflow-hidden bg-[#10141b] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(25,94,226,0.16),transparent_24%),radial-gradient(circle_at_82%_16%,rgba(86,226,64,0.08),transparent_20%)]" />
        <div className="relative mx-auto max-w-screen-2xl">
          <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                Trust and Delivery
              </p>
              <h2 className="mt-4 max-w-3xl font-headline text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                Built to support service brands, operations teams and digital-first businesses
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[color:var(--text-secondary)]">
                {clients.description ||
                  `Our delivery model is designed for businesses that need a reliable partner for websites, software systems and digital growth support.`}
              </p>
              <Link
                href="/clients"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--accent-soft)] transition hover:gap-3"
              >
                Explore Industries
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {clientProof.map((item) => (
                <div
                  key={`${item.label}-${item.value}`}
                  className="rounded-[1.5rem] border border-white/8 bg-[rgba(20,24,31,0.82)] px-5 py-6 shadow-[0_22px_60px_-42px_rgba(0,0,0,0.84)] backdrop-blur-[14px]"
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

          <div className="mt-10 rounded-[2rem] border border-white/8 bg-[rgba(16,20,28,0.9)] p-4 shadow-[0_24px_70px_-44px_rgba(0,0,0,0.9)] backdrop-blur-[14px] sm:p-6">
            <MarqueeRow items={marqueeLabels} showLabel={false} />
          </div>
        </div>
      </section>

      <section className="bg-[#0f1217] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-14 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <h2 className="font-headline text-xl font-black uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
              Our Process
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid gap-10 md:grid-cols-4">
            {process.map((step, index) => (
              <article key={step.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--text-muted)]/40 bg-[#121722] font-headline text-lg font-black text-white">
                  0{index + 1}
                </div>
                <h3 className="mt-5 font-headline text-xl font-black tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <h2 className="mb-12 text-center font-headline text-3xl font-black tracking-tight text-white sm:text-5xl">
            Featured Products and Solutions
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <article
                key={product.id || product.title}
                className="group overflow-hidden rounded-[1.2rem] border border-white/8 bg-[#1a1f28] p-1 transition duration-300 hover:-translate-y-1 hover:border-white/16"
              >
                <div className="relative h-56 overflow-hidden rounded-[0.95rem]">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                    {product.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-7 text-[color:var(--text-secondary)]">
                    {product.description}
                  </p>
                  <Link
                    href="/products"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--text-muted)] transition group-hover:text-[#9fb7ff]"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
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
                {finalCta.title || "Ready to upgrade your website, software or digital workflow?"}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[color:var(--text-secondary)]">
                {finalCta.description ||
                  "Share your requirement and we will help you plan the right website, software, ERP or digital marketing solution for your business."}
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
                <PrimaryLink href={finalCta.primaryHref || "/contact"}>
                  {finalCta.primaryLabel || "Start a Project"}
                </PrimaryLink>
                <SecondaryLink href={finalCta.secondaryHref || "/services"}>
                  {finalCta.secondaryLabel || "See the Workflow"}
                </SecondaryLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
