import Link from "next/link";
import {
  ArrowRight,
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

import {
  Chip,
  EmptyState,
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
  containerClass,
  ctaShellClass,
  firstSectionClass,
  pageClass,
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

function shortFeature(service) {
  return (service.features || []).slice(0, 2).map((item) => item.name).join(" • ");
}

export default function ServicesPageContent({ services, content }) {
  const pageContent = content?.servicesPage || {};
  const heroTitle =
    pageContent.title ||
    "Digital services shaped around visibility, usability and business performance";
  const heroDescription =
    pageContent.description ||
    "Deploying precision-engineered digital solutions across the tactical landscape of modern commerce and aerospace instrumentation.";
  const moduleHighlights = pageContent?.highlights?.length
    ? pageContent.highlights.slice(0, 4)
    : [
        `${services.length} live service modules connected to the public website.`,
        "Cards stay compact so discovery feels sharper and cleaner.",
        "Every service points toward a detail page or direct enquiry path.",
        "The layout stays scalable as backend entries keep growing.",
      ];

  return (
    <main className={pageClass}>
      <section className={`${firstSectionClass} relative overflow-hidden pb-14 sm:pb-16`}>
        <div className="veagle-section-wash" />
        <div className="veagle-grid-background" />

        <div className={`${containerClass} relative z-10 grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center`}>
          <div className="space-y-6">
            <Eyebrow className="border-white/10 bg-white/[0.04] text-[#8ba8ff]">
              Operational Fleet
            </Eyebrow>

            <div className="space-y-5">
              <h1 className="max-w-4xl font-headline text-4xl font-black leading-[0.94] tracking-[-0.05em] text-white sm:text-5xl lg:text-[4.6rem]">
                {heroTitle}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#c7d2e5] sm:text-lg">
                {heroDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <PrimaryLink href="/contact" className="bg-white text-[#0c2d7a] shadow-none">
                Initialize Mission
              </PrimaryLink>
              <SecondaryLink
                href="/products"
                className="border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.08]"
              >
                Explore Catalog
              </SecondaryLink>
            </div>
          </div>

          <div className="relative min-h-[360px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[320px] w-[320px] rounded-full">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(29,117,255,0.18),rgba(7,11,20,0)_64%)]" />
                <div className="absolute inset-[18%] rounded-full border border-cyan-400/30" />
                <div className="absolute inset-[28%] rounded-full border border-cyan-300/20" />
                <div className="absolute inset-[38%] rounded-full border border-[#56e240]/20" />
                <div className="absolute inset-x-[5%] top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(88,201,255,0.7),transparent)]" />
                <div className="absolute inset-y-[17%] left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(88,201,255,0.35),transparent)]" />
                <div className="absolute inset-[31%] flex items-center justify-center rounded-full bg-[linear-gradient(180deg,rgba(18,28,46,0.96),rgba(9,15,27,0.96))] shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
                  <div className="space-y-2 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#74b8ff]">
                      Service Work
                    </p>
                    <p className="font-headline text-lg font-black tracking-tight text-white">
                      Orbital Command
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} pt-8`}>
        <div className={containerClass}>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Service Modules</p>
              <p className="text-sm text-[color:var(--text-secondary)]">
                Strategic deployment of technology across core sectors.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[#56e240]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#56e240]" />
              All systems active
            </div>
          </div>

          {services.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => {
                const Icon = resolveServiceIcon(service.title);
                const featureText = shortFeature(service);

                return (
                  <Link
                    key={service.slug || service.id || service.title}
                    href={service.slug ? `/services/${service.slug}` : "/services"}
                    className="group rounded-[1.65rem] bg-[linear-gradient(180deg,#17191d,#131519)] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.26)] transition duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.05)] text-[#b8c7ef]">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#6f7788]">
                          Module 0{index + 1}
                        </p>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#56e240]">
                          Ready
                        </p>
                      </div>
                    </div>

                    <h2 className="mt-8 font-headline text-[1.32rem] font-black leading-tight tracking-tight text-white">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#b9c4d8]">
                      {service.description}
                    </p>

                    <div className="mt-5 min-h-[44px]">
                      {featureText ? (
                        <Chip className="border-white/8 bg-white/[0.04] text-[#dbe4f7]">
                          {featureText}
                        </Chip>
                      ) : null}
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#dbe4f7]">
                      Open Module
                      <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No live service modules yet"
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
              <Eyebrow className="border-white/10 bg-white/[0.08] text-white">
                Need a custom mix?
              </Eyebrow>
              <div className="space-y-4">
                <h2 className="max-w-xl font-headline text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {pageContent.ctaTitle || "Need a combined plan across multiple services?"}
                </h2>
                <p className="max-w-xl text-base leading-8 text-[#dde4ff]">
                  {pageContent.ctaDescription ||
                    "Unlock operational synergy with a unified mission protocol. We tailor integrated strategies that align development, design and marketing into a single powerhouse."}
                </p>
              </div>
              <PrimaryLink href="/contact" className="bg-white text-[#16367d] shadow-none">
                Request Custom Configuration
              </PrimaryLink>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {moduleHighlights.map((item, index) => {
                const Icon = ctaIcons[index % ctaIcons.length];

                return (
                  <div
                    key={item}
                    className="flex min-h-[116px] flex-col justify-between rounded-[1.55rem] bg-[rgba(18,24,38,0.58)] p-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06] text-[#dce4ff]">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <p className="text-sm leading-6 text-[#dce4ff]">{item}</p>
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
