"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  BriefcaseBusiness,
  Code2,
  Database,
  Globe,
  Megaphone,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  EmptyState,
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
  buttonGroupClass,
  containerClass,
  ctaShellClass,
  firstSectionClass,
  pageClass,
  pageHeroTitleClass,
  sectionClass,
} from "@/components/site/UiBits";

const iconMatchers = [
  { pattern: /(website|web|design|ui|ux)/i, icon: Globe },
  { pattern: /(e-commerce|commerce|shop|store)/i, icon: ShoppingCart },
  { pattern: /(software|development|platform|code)/i, icon: Code2 },
  { pattern: /(erp|system|dashboard|data)/i, icon: Database },
  { pattern: /(mobile|android|ios|app)/i, icon: Smartphone },
  { pattern: /(marketing|seo|smo|growth)/i, icon: Megaphone },
  { pattern: /(resource|outsour|staff)/i, icon: Users2 },
];

const ctaIcons = [Sparkles, Boxes, Database, Globe];

function resolveServiceIcon(title) {
  return iconMatchers.find((item) => item.pattern.test(title || ""))?.icon || BriefcaseBusiness;
}


export default function ServicesPageContent({ services, content }) {
  const pageContent = content?.servicesPage || {};
  const heroTitle =
    pageContent.title ||
    "Website development, software, ERP, digital marketing and business support services in one place";
  const heroDescription =
    pageContent.description ||
    "Unified technical delivery for enterprise-grade software, high-conversion web platforms, and automated business workflows.";
  const moduleHighlights = pageContent?.highlights?.length
    ? pageContent.highlights.slice(0, 4)
    : [
        `${services.length} enterprise-grade service modules ready for deployment.`,
        "Proprietary engineering standards applied to every delivery node.",
        "Dynamic page builder integration for custom service blueprints.",
        "Real-time metadata management via centralized admin portal.",
      ];

  return (
    <main className={pageClass}>
      <section className={`${firstSectionClass} relative overflow-hidden pb-14 sm:pb-16`}>
        <div className="veagle-section-wash" />
        <div className="veagle-grid-background" />

        <div className={`${containerClass} relative z-10 flex flex-col items-center text-center`}>
          <div className="max-w-4xl space-y-10">
            <div className="flex flex-col items-center space-y-6">
              <Eyebrow>
                {pageContent.eyebrow || "Our Services"}
              </Eyebrow>

              <div className="space-y-5">
                <h1 className={`${pageHeroTitleClass} text-white`}>
                  {heroTitle}
                </h1>
                <p className="mx-auto max-w-2xl text-[1.1rem] leading-8 text-[color:var(--text-secondary)]">
                  {heroDescription}
                </p>
              </div>

              <div className={cn(buttonGroupClass, "justify-center")}>
                <PrimaryLink href="/contact">Discuss Your Requirement</PrimaryLink>
                <SecondaryLink href="/contact">
                  Request a Quote
                </SecondaryLink>
              </div>
            </div>

            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:bg-white/[0.06]">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/90">
                  Active Services
                </p>
                <p className="mt-3 font-headline text-3xl font-black tracking-tight text-white">
                  {services.length}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:bg-white/[0.06]">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/90">
                  Experience
                </p>
                <p className="mt-3 font-headline text-2xl font-black tracking-tight text-white">
                  User Friendly
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:bg-white/[0.06]">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/90">
                  Delivery
                </p>
                <p className="mt-3 font-headline text-2xl font-black tracking-tight text-white">
                  Dynamic
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} pt-8`}>
        <div className={containerClass}>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="font-headline text-[11px] font-black uppercase tracking-[0.24em] text-white">
                Service Directory
              </p>
              <p className="text-sm text-[color:var(--text-secondary)]">
                Open any service card to learn more about the scope, features and next steps.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#8ba8ff]">
              <span className="h-2 w-2 rounded-full bg-[#8ba8ff] shadow-[0_0_8px_rgba(139,168,255,0.4)]" />
              SEO-Ready, Mobile-Friendly Pages
            </div>
          </div>

          {services.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => {
                const Icon = resolveServiceIcon(service.title);
                const detailHref = service.slug ? `/services/${service.slug}` : "/services";

                return (
                  <Link
                    key={service.slug || service.id || service.title}
                    href={detailHref}
                    className="group overflow-hidden rounded-[1.4rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,#171b24,#1d222d)] shadow-[0_24px_70px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--border-strong)] hover:shadow-[0_26px_80px_rgba(25,94,226,0.15)]"
                  >
                    {/* Image section */}
                    <div className="relative h-44 overflow-hidden sm:h-48">
                      <Image
                        alt={service.title}
                        className="object-cover transition duration-500 group-hover:scale-105"
                        fill
                        sizes="(max-width: 1280px) 100vw, 33vw"
                        src={service.imageUrl}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,18,26,0.85))]" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/12 bg-[rgba(15,18,26,0.75)] text-white backdrop-blur-sm">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                          Service 0{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content section */}
                    <div className="space-y-4 px-4 pb-4 pt-3.5">
                      <div>
                        <h3 className="font-headline text-2xl font-black tracking-tight text-white leading-tight">
                          {service.title}
                        </h3>
                        <p className="mt-2.5 min-h-[64px] text-[13px] leading-6 text-[color:var(--text-secondary)]">
                          {service.description}
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {(service.features || []).slice(0, 3).map((feature) => (
                          <div
                            key={feature.id || feature.name}
                            className="flex items-center gap-3"
                          >
                            <div className="h-1 w-1 shrink-0 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_rgba(25,94,226,0.3)]" />
                            <span className="text-[13px] font-medium leading-none text-[color:var(--text-secondary)]">
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-4">
                        <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-white transition group-hover:text-[#9fb7ff]">
                          View Service
                          <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-[#9ec0ff] transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No services published yet"
              description="Add services from the dashboard and this page will render them automatically."
            />
          )}
        </div>
      </section>

      <section className="pb-24 sm:pb-28">
        <div className={containerClass}>
          <div
            className={`${ctaShellClass} grid gap-6 bg-[linear-gradient(135deg,#1c2f6b,#18275a)] p-6 shadow-[0_30px_90px_rgba(6,12,28,0.32)] lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:p-8`}
          >
            <div className="space-y-5">
              <Eyebrow>
                Need a custom solution?
              </Eyebrow>
              <div className="space-y-4">
                <h2 className="max-w-xl font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
                  {pageContent.ctaTitle || "Need a website, software platform or marketing-ready business system?"}
                </h2>
                <p className="max-w-xl text-base leading-8 text-[color:var(--text-secondary)]">
                  {pageContent.ctaDescription ||
                    "We can combine website development, software, ERP, mobile apps, SEO and support services into a solution that matches your business goals."}
                </p>
              </div>
              <PrimaryLink href="/contact">Discuss Your Requirement</PrimaryLink>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {moduleHighlights.map((item, index) => {
                const Icon = ctaIcons[index % ctaIcons.length];

                return (
                  <div
                    key={item}
                    className="flex min-h-[116px] flex-col justify-between rounded-[1.55rem] bg-[rgba(18,24,38,0.58)] p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06] text-[color:var(--text-primary)]">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <p className="text-sm leading-6 text-[color:var(--text-secondary)]">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
