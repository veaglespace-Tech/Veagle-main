import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import {
  Chip,
  EmptyState,
  Eyebrow,
  Panel,
  PrimaryLink,
  SecondaryLink,
  SectionIntro,
  containerClass,
  firstSectionClass,
  pageClass,
  pageHeroTitleClass,
  sectionClass,
} from "@/components/site/UiBits";

export default function ServiceDetailPageContent({ service, relatedServices }) {
  const features = service.features || [];
  const detailHeading = service.detailTitle?.trim() || service.title;
  const detailDescription = service.detailDescription?.trim() || service.description;

  // Parse pageContent
  let blocks = null;
  try {
    if (service.pageContent) {
      const parsed = JSON.parse(service.pageContent);
      if (Array.isArray(parsed) && parsed.length > 0) {
        blocks = parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse pageContent", e);
  }

  const renderBlocks = () => {
    return (blocks || []).map((block, index) => {
      if (block.type === "hero") {
        return (
          <section key={block.id || index} className={`${firstSectionClass} relative flex min-h-[70vh] items-center overflow-hidden pb-24 sm:pb-32 lg:pb-40`}>
            {block.content.imageUrl && (
              <div className="absolute inset-0 z-0">
                <Image 
                  src={block.content.imageUrl} 
                  alt={block.content.title}
                  fill
                  className="object-cover opacity-30 brightness-[0.5] grayscale-[0.2]"
                  unoptimized
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--page-bg)]/80 via-[color:var(--page-bg)]/40 to-[color:var(--page-bg)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--page-bg)_100%)]" />
              </div>
            )}
            
            <div className="veagle-section-wash" />
            <div className="veagle-grid-background pointer-events-none" />
            
            <div className={`${containerClass} relative z-10 mx-auto max-w-6xl`}>
              <div className="flex flex-col items-center text-center">
                <Eyebrow className="mb-8">
                  Service Overview
                </Eyebrow>
                <h1 className={`${pageHeroTitleClass} text-[color:var(--text-primary)]`}>
                  {block.content.title}
                </h1>
                <p className="mt-10 max-w-3xl text-lg leading-relaxed text-[color:var(--text-secondary)] opacity-90 sm:text-xl lg:text-2xl">
                  {block.content.description}
                </p>
                <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
                  <PrimaryLink href="#initiate">Discuss This Service</PrimaryLink>
                  <div className="h-px w-12 bg-[color:var(--border)] sm:h-12 sm:w-px" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
                    Section {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "image") {
        return (
          <section key={block.id || index} className={sectionClass}>
            <div className={containerClass}>
              <div className="mx-auto max-w-5xl">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-5 shadow-[color:var(--shadow-card)]">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[1.8rem] border border-[color:var(--border-strong)]/20">
                    <Image 
                      src={block.content.imageUrl} 
                      alt={block.content.caption || "Service visual"}
                      fill
                      className="object-cover transition duration-1000 hover:scale-105"
                      unoptimized
                    />
                    {!block.content.imageUrl && (
                      <div className="flex h-full w-full items-center justify-center bg-[color:var(--surface-strong)] text-[color:var(--text-muted)] italic">
                        Visual asset pending configuration
                      </div>
                    )}
                  </div>
                </div>
                {block.content.caption && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[color:var(--border)]" />
                    <p className="font-headline text-[11px] font-black uppercase tracking-[0.3em] text-[color:var(--text-muted)]">
                      {block.content.caption}
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[color:var(--border)]" />
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "text") {
        return (
          <section key={block.id || index} className={sectionClass}>
            <div className={containerClass}>
              <div className="mx-auto max-w-4xl">
                <SectionIntro 
                  title={block.content.heading}
                  align="center"
                />
                <div className="mt-10 columns-1 gap-12 text-lg leading-relaxed text-[color:var(--text-secondary)] sm:columns-1 lg:text-xl">
                  {block.content.text.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-6 last:mb-0 first-letter:float-left first-letter:mr-3 first-letter:text-5xl first-letter:font-black first-letter:text-[color:var(--accent)]">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "features") {
        return (
          <section key={block.id || index} className={sectionClass}>
            <div className={containerClass}>
              <div className="mb-16">
                <SectionIntro 
                  eyebrow="Key Features"
                  title={block.content.title}
                  align="center"
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(block.content.points || []).map((point, i) => (
                  <div key={i} className="group relative rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-8 transition duration-300 hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--surface-strong)]">
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[color:var(--accent)]/5 blur-2xl transition duration-500 group-hover:bg-[color:var(--accent)]/10" />
                    <div className="relative space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent)]/10 text-sm font-black text-[color:var(--accent)]">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                        {point}
                      </h3>
                      <p className="text-sm leading-relaxed text-[color:var(--text-secondary)] opacity-80">
                        A practical capability designed to improve delivery quality, usability and long-term scalability.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      return null;
    });
  };

  return (
    <main className={pageClass}>
      {blocks ? (
        <div className="space-y-0">
          {renderBlocks()}
          
          <section id="initiate" className="pb-32 pt-16">
            <div className={containerClass}>
              <div className="grid gap-12 xl:grid-cols-2 xl:items-start">
                 <div className="sticky top-24 space-y-10">
                   <SectionIntro 
                     eyebrow="Talk to Our Team" 
                     title="Let's plan the right solution for your requirement" 
                     description="Share your goals and we will help you map the best delivery approach for this service." 
                   />
                   
                   <div className="grid gap-4 sm:grid-cols-2">
                     <div className="rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)]">Active Spec</p>
                        <p className="mt-3 font-headline text-2xl font-black text-[color:var(--text-primary)]">{service.title}</p>
                     </div>
                     <div className="rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)]">Support</p>
                        <p className="mt-3 font-headline text-2xl font-black text-[color:var(--text-primary)]">Veagle Space Team</p>
                     </div>
                   </div>

                   <div className="space-y-6">
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-[color:var(--text-muted)]">Related Services</p>
                      <div className="grid gap-4">
                        {relatedServices.slice(0, 2).map(item => (
                          <Link key={item.slug} href={`/services/${item.slug}`} className="group relative overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-6 transition hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--surface-strong)]">
                             <div className="flex items-center justify-between">
                               <div>
                                 <h4 className="font-headline text-lg font-black text-[color:var(--text-primary)]">{item.title}</h4>
                                 <p className="mt-1 text-xs text-[color:var(--text-muted)] line-clamp-1">{item.description}</p>
                               </div>
                               <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--page-bg)] transition group-hover:bg-[color:var(--accent)] group-hover:text-white">
                                 <ArrowRight className="h-4 w-4" />
                               </div>
                             </div>
                          </Link>
                        ))}
                      </div>
                   </div>
                 </div>

                  <div className="relative">
                    <div className="absolute -inset-4 z-0 rounded-[3rem] bg-[color:var(--accent)]/5 blur-3xl" />
                    <div className="relative z-10 overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)]/50 shadow-[color:var(--shadow-card)] backdrop-blur-md">
                      <LeadCaptureForm defaultService={service.title} />
                    </div>
                  </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <>
          <section className={`${firstSectionClass} relative overflow-hidden pb-16 sm:pb-20`}>
            <div className="veagle-section-wash" />
            <div className="veagle-grid-background" />

            <div className={`${containerClass} relative z-10 grid gap-12 xl:grid-cols-[1.02fr_0.98fr] xl:items-center`}>
              <div className="relative group">
                <div className="absolute -inset-4 rounded-[2.5rem] bg-[color:var(--accent)]/10 blur-3xl transition duration-700 group-hover:bg-[color:var(--accent)]/20" />
                <div className="relative overflow-hidden rounded-[2.5rem] border border-[color:var(--border-strong)] bg-[linear-gradient(180deg,#171b24,#1d222d)] p-4 shadow-[color:var(--shadow-card)]">
                  <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[#101622] p-6 lg:p-10">
                    <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,#0f1724,#111b29)] sm:min-h-[440px]">
                      <Image
                        alt={service.title}
                        className="object-contain p-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition duration-700 group-hover:scale-105"
                        fill
                        sizes="(max-width: 1280px) 100vw, 52vw"
                        src={service.imageUrl}
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <Eyebrow>Service Details</Eyebrow>
                  <h1 className={`${pageHeroTitleClass} text-[color:var(--text-primary)]`}>
                    {detailHeading}
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--text-secondary)] sm:text-xl">
                    {detailDescription}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Specifications", value: features.length },
                    { label: "Architecture", value: "Modular" },
                    { label: "Status", value: "Available" }
                  ].map((stat, i) => (
                    <div key={i} className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)]">{stat.label}</p>
                      <p className="mt-3 font-headline text-3xl font-black text-[color:var(--text-primary)]">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {features.length ? (
                    features.map((feature) => (
                      <Chip key={feature.id || feature.name} className="border-[color:var(--border)] bg-[color:var(--surface-strong)] px-5 py-2">
                        {feature.name}
                      </Chip>
                    ))
                  ) : (
                    <Chip className="border-dashed opacity-50 italic">Add features in the dashboard</Chip>
                  )}
                </div>

                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                  <PrimaryLink href="#initiate">Get a Quote</PrimaryLink>
                  <SecondaryLink href="/services">Back to Services</SecondaryLink>
                </div>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={`${containerClass} grid gap-12 xl:grid-cols-[0.85fr_1.15fr]`}>
              <div className="space-y-8">
                <SectionIntro
                  eyebrow="Service Scope"
                  title={detailHeading}
                  description={detailDescription}
                />
                <Panel className="space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--accent)]">What This Service Covers</p>
                  <div className="space-y-5">
                    {[
                      "Clear requirement planning aligned with business goals.",
                      "Responsive execution built for usability and long-term maintainability.",
                      "Structured delivery with a straightforward inquiry and follow-up flow."
                    ].map((text, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)] shadow-[0_0_10px_var(--accent)]" />
                        <p className="text-base leading-relaxed text-[color:var(--text-secondary)]">{text}</p>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {features.length ? (
                  features.map((feature, index) => (
                    <div key={feature.id || feature.name} className="group rounded-[1.8rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-7 transition duration-300 hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--surface-strong)]">
                      <div className="flex flex-col h-full gap-5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--accent)]/10 text-sm font-black text-[color:var(--accent)]">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="space-y-3">
                          <h3 className="font-headline text-xl font-black text-[color:var(--text-primary)]">{feature.name}</h3>
                          <p className="text-sm leading-relaxed text-[color:var(--text-secondary)] opacity-80">
                            A focused part of the {service.title} offering designed to support real business needs and smoother delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2">
                    <EmptyState title="No features added yet" description="Configure features in the admin dashboard." />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section id="initiate" className="pb-32 pt-16">
            <div className={containerClass}>
                <div className="relative overflow-hidden rounded-[3rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] shadow-[color:var(--shadow-card)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,var(--accent)_0%,transparent_50%)] opacity-[0.03]" />
                  <div className="relative z-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center p-8 sm:p-12">
                    <div className="space-y-6">
                       <SectionIntro 
                          eyebrow="Get Started" 
                          title="Let's discuss your project" 
                          description="Connect with our team to talk about scope, timeline, goals and the right next step." 
                       />
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full border border-[color:var(--border)] bg-[color:var(--page-bg)] p-0.5">
                             <div className="h-full w-full rounded-full bg-[color:var(--accent)]" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-[color:var(--text-primary)]">Veagle Space</p>
                             <p className="text-[10px] text-[color:var(--text-muted)] uppercase tracking-widest leading-none">Project Team</p>
                          </div>
                       </div>
                    </div>
                    <div className="overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--page-bg)]/40 backdrop-blur-sm">
                       <LeadCaptureForm defaultService={service.title} />
                    </div>
                  </div>
                </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
