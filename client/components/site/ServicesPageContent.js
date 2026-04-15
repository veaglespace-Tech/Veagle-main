"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
  buttonGroupClass,
  ctaShellClass,
  pageClass,
  pageHeroTitleClass,
} from "@/components/site/UiBits";
import { cn, slugify } from "@/lib/utils";
import { pageArtwork } from "@/lib/visuals";

export default function ServicesPageContent({ services, content }) {
  const pageContent = content?.servicesPage || {};
  const activeServices = Array.isArray(services) ? services : [];

  const heroTitle =
    pageContent.title || "Full-stack website development, custom software systems and technical SEO services.";
  const heroDescription =
    pageContent.description ||
    "We design, build and optimize digital products that are easier for teams to manage and better for brands to scale.";

  return (
    <main className={pageClass}>
      {/* Hero Section - Permanently Dark */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[#0c0e18] px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="absolute inset-0">
          <Image
            src={pageArtwork.services}
            alt="Services background"
            fill
            className="object-cover opacity-50 brightness-[0.4]"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e18]/90 via-[#0c0e18]/60 to-[#0c0e18]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0c0e18_100%)] opacity-80" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-8">
              <Eyebrow className="text-blue-100/60 after:bg-blue-100/20">
                {pageContent.eyebrow || "Our Services"}
              </Eyebrow>

              <div className="space-y-5">
                <h1 className={`${pageHeroTitleClass} text-white`}>
                  {heroTitle}
                </h1>
                <p className="mx-auto max-w-2xl text-[1.1rem] leading-8 text-blue-100/70">
                  {heroDescription}
                </p>
              </div>

              <div className={cn(buttonGroupClass, "justify-center")}>
                <PrimaryLink href="/contact">Discuss Your Requirement</PrimaryLink>
                <SecondaryLink href="/contact" className="border-white/10 text-white hover:bg-white/5">
                  Request a Quote
                </SecondaryLink>
              </div>
            </div>

            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3 mt-16">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:bg-white/[0.06]">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/90">
                  Active Services
                </p>
                <p className="mt-3 font-headline text-3xl font-black tracking-tight text-white">
                  {activeServices.length}
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

      {/* Briefing Section - Unified Pattern */}
      <section className="bg-[color:var(--page-bg-soft)] px-4 py-20 sm:px-6 lg:px-8 lg:py-24 border-y border-[color:var(--border)]">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <Eyebrow className="text-[color:var(--accent)]">
              What We Help With
            </Eyebrow>
            <h2 className="mt-6 font-headline text-4xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-5xl">
              Core Service Strengths
            </h2>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
              Strategic technical delivery across multiple engineering nodes, optimized for business scalability and operational clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeServices.map((service, index) => {
              const serviceSlug = service.slug || slugify(service.title);

              return (
                <article
                  key={service.id || `service-${index}`}
                  className="group veagle-premium-card relative flex flex-col overflow-hidden rounded-[1.25rem]"
                >
                  <div className="relative z-10 flex h-full flex-col p-8">
                    <div className="mb-8 flex items-center justify-between">
                      <div className="h-[2px] w-12 bg-[color:var(--accent)] transition-all duration-500 group-hover:w-20" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="font-headline text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {service.title}
                    </h3>
                    
                    <p className="mt-6 flex-grow text-sm leading-8 text-[color:var(--text-muted)] group-hover:text-white/90 transition-colors">
                      {service.content ||
                        "Full-cycle development from discovery to deployment, ensuring a project that is easier for you to manage and scale."}
                    </p>

                    <Link
                      href={`/services/${serviceSlug}`}
                      className="mt-10 inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-[color:var(--accent)] transition-all hover:gap-4"
                    >
                      Discovery Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {!activeServices.length ? (
            <div className="mt-8 rounded-[1.25rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-12 text-center">
              <h3 className="font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                No active services listed yet
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-muted)]">
                Add services from the dashboard to populate your official service directory here.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* CTA Section - Unified Pattern */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className={`mx-auto max-w-6xl ${ctaShellClass} border border-white/10 bg-[linear-gradient(135deg,#182a59,#101a33)] shadow-[0_30px_90px_-44px_rgba(6,12,28,0.72)]`}>
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
                Ready to engineer your next milestone?
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-blue-100/70 sm:text-lg">
                Let&apos;s discuss how we can build a technical infrastructure that scales with your ambition.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <PrimaryLink href="/contact">
                  Start a Conversation
                </PrimaryLink>
                <SecondaryLink href="/portfolio" className="border-white/10 text-white hover:bg-white/5">
                  View Our Portfolio
                </SecondaryLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
