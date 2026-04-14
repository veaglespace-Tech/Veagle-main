import Image from "next/image";
import Link from "next/link";

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
  mutedCardClass,
  pageClass,
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
    return blocks.map((block) => {
      if (block.type === "hero") {
        return (
          <section key={block.id} className={`${firstSectionClass} relative flex min-h-[60vh] items-center overflow-hidden pb-20 sm:pb-28 lg:pb-36`}>
            {block.content.imageUrl && (
              <div className="absolute inset-0 z-0">
                <Image 
                  src={block.content.imageUrl} 
                  alt={block.content.title}
                  fill
                  className="object-cover opacity-30 brightness-[0.6]"
                  unoptimized
                  priority
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,var(--page-bg))]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[color:var(--page-bg)]" />
              </div>
            )}
            
            <div className="veagle-section-wash" />
            <div className="veagle-grid-background pointer-events-none" />
            
            <div className={`${containerClass} relative z-10 mx-auto max-w-6xl text-center`}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[color:var(--surface-strong)] px-4 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Service Intelligence</span>
              </div>
              <h1 className="mt-8 font-headline text-5xl font-black leading-[0.92] tracking-tighter text-white sm:text-7xl lg:text-9xl">
                {block.content.title}
              </h1>
              <p className="mx-auto mt-10 max-w-3xl text-lg leading-8 text-[color:var(--text-secondary)] sm:text-xl lg:text-2xl">
                {block.content.description}
              </p>
            </div>
          </section>
        );
      }

      if (block.type === "image") {
        return (
          <section key={block.id} className={sectionClass}>
            <div className={containerClass}>
              <div className="mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-4 shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.8rem]">
                  <Image 
                    src={block.content.imageUrl} 
                    alt={block.content.caption || "Service visual"}
                    fill
                    className="object-cover transition duration-700 hover:scale-105"
                    unoptimized
                  />
                  {!block.content.imageUrl && (
                    <div className="flex h-full w-full items-center justify-center bg-[color:var(--surface-strong)] text-white/10">
                      Empty image block - Add URL in builder
                    </div>
                  )}
                </div>
                {block.content.caption && (
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <div className="h-px w-10 bg-white/10" />
                    <p className="text-sm italic tracking-wide text-[color:var(--text-muted)]">
                      {block.content.caption}
                    </p>
                    <div className="h-px w-10 bg-white/10" />
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "text") {
        return (
          <section key={block.id} className={sectionClass}>
            <div className={containerClass}>
              <div className="mx-auto max-w-4xl text-center">
                <h2 className="font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
                  {block.content.heading}
                </h2>
                <div className="mt-8 text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
                  {block.content.text.split("\n\n").map((para, i) => (
                    <p key={i} className="mb-4">{para}</p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      }

      if (block.type === "features") {
        return (
          <section key={block.id} className={sectionClass}>
            <div className={containerClass}>
              <div className="mb-12 text-center">
                <h2 className="font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)] sm:text-4xl">
                  {block.content.title}
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(block.content.points || []).map((point, i) => (
                  <div key={i} className={mutedCardClass}>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)] text-[10px] font-black text-white">
                        {i + 1}
                      </div>
                      <p className="text-sm font-semibold text-[color:var(--text-secondary)]">
                        {point}
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
          
          {/* Always add CTA and Related at the end of custom pages */}
          <section className="pb-24 sm:pb-28">
            <div className={`${containerClass} grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-start`}>
               <div className="space-y-6">
                 <SectionIntro 
                   eyebrow="Initiate engagement" 
                   title="Discuss your architecture" 
                   description="Our engineering team will coordinate the full execution roadmap based on the specific service modules active above." 
                 />
                 <LeadCaptureForm defaultService={service.title} />
               </div>
               <div className="space-y-6">
                 <SectionIntro 
                   eyebrow="Related nodes" 
                   title="Operational Ecosystem" 
                   description="Explore vertically aligned solutions that complement this specific technical orbit." 
                 />
                 <div className="grid gap-4">
                   {relatedServices.slice(0, 2).map(item => (
                     <article key={item.slug} className="group rounded-[1.5rem] border border-[color:var(--border)] bg-[rgba(255,255,255,0.03)] p-6 transition hover:bg-[rgba(255,255,255,0.05)]">
                        <h3 className="font-headline text-xl font-bold text-[color:var(--text-primary)]">{item.title}</h3>
                        <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{item.description}</p>
                        <Link href={`/services/${item.slug}`} className="mt-4 inline-block text-[10px] font-black uppercase tracking-widest text-[color:var(--accent)] group-hover:text-[color:var(--text-primary)]">Open Module Protocol →</Link>
                     </article>
                   ))}
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

            <div className={`${containerClass} relative z-10 grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center`}>
              <div className="overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,#171b24,#1d222d)] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.3)]">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-[rgba(93,126,194,0.2)] bg-[#101622] p-5">
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[rgba(43,98,237,0.28)] blur-[2px]" />
                  <div className="relative rounded-[1.2rem] border border-[rgba(93,126,194,0.18)] bg-[#0d1420] p-5">
                    <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-[1rem] border border-[rgba(93,126,194,0.12)] bg-[linear-gradient(180deg,#0f1724,#111b29)] sm:min-h-[420px]">
                      <Image
                        alt={service.title}
                        className="object-contain p-6"
                        fill
                        sizes="(max-width: 1280px) 100vw, 52vw"
                        src={service.imageUrl}
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Eyebrow>Module Details</Eyebrow>

                <div className="space-y-4">
                  <h1 className="font-headline text-4xl font-black tracking-tighter text-[color:var(--text-primary)] sm:text-5xl lg:text-6xl">
                    {detailHeading}
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-[color:var(--text-secondary)]">
                    {detailDescription}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[rgba(255,255,255,0.04)] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                      Specifications
                    </p>
                    <p className="mt-3 font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
                      {features.length}
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[rgba(255,255,255,0.04)] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                      Architecture
                    </p>
                    <p className="mt-3 font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
                      Modular
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[rgba(255,255,255,0.04)] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                      Protocol
                    </p>
                    <p className="mt-3 font-headline text-3xl font-black tracking-tight text-[color:var(--text-primary)]">
                      Active
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {features.length ? (
                    features.map((feature) => (
                      <Chip
                        key={feature.id || feature.name}
                        className="border-white/10 bg-white/[0.05] text-[color:var(--text-secondary)]"
                      >
                        {feature.name}
                      </Chip>
                    ))
                  ) : (
                    <Chip className="border-white/10 bg-white/[0.05] text-[color:var(--text-muted)] italic">
                      Initialize technical specifications in the dashboard to populate these nodes.
                    </Chip>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <PrimaryLink href="/contact">Configure Service</PrimaryLink>
                  <SecondaryLink href="/services">System Directory</SecondaryLink>
                </div>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className={`${containerClass} grid gap-8 xl:grid-cols-[0.92fr_1.08fr]`}>
              <div className="space-y-6">
                <SectionIntro
                  eyebrow="Technical scope"
                  title={detailHeading}
                  description={detailDescription}
                />

                <Panel className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                    Operation Matrix
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_rgba(25,94,226,0.3)]" />
                      <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
                        Centralized content orchestration via dashboard-driven metadata points.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_rgba(25,94,226,0.3)]" />
                      <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
                        Dynamic visual assets synchronized across global delivery layers.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_rgba(25,94,226,0.3)]" />
                      <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
                        Modular technical specifications managed through the integrated service portal.
                      </p>
                    </div>
                  </div>
                </Panel>
              </div>

              <div className="grid gap-4">
                {features.length ? (
                  features.map((feature, index) => (
                    <div key={feature.id || feature.name} className={mutedCardClass}>
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--accent)] text-sm font-black text-white">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <h2 className="font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
                            {feature.name}
                          </h2>
                          <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">
                            {feature.name} is a core operational node of this protocol, specifically engineered to provide a robust technical foundation within the {service.title} architecture.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="Initialize Module Points"
                    description="Add operational specifications in the dashboard to populate this technical matrix."
                  />
                )}
              </div>
            </div>
          </section>

          <section className="pb-24 sm:pb-28">
            <div className={`${containerClass} grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-start`}>
              <div className="space-y-6">
                <SectionIntro
                  eyebrow="Related configurations"
                  title="Ecosystem Synergy"
                  description="Synchronize your project with complementary service modules from our technical directory."
                />

                {relatedServices.length ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    {relatedServices.map((item) => (
                      <article
                        key={item.slug}
                        className="group overflow-hidden rounded-[1.7rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,#171b24,#1d222d)] shadow-[0_24px_70px_rgba(0,0,0,0.22)] transition hover:border-[color:var(--accent)]/30"
                      >
                        <div className="p-4">
                          <div className="relative overflow-hidden rounded-[1.25rem] border border-[rgba(93,126,194,0.2)] bg-[#101622] p-4">
                            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[rgba(43,98,237,0.24)] blur-[2px]" />
                            <div className="relative rounded-[1rem] border border-[rgba(93,126,194,0.18)] bg-[#0d1420] p-4">
                              <div className="relative flex min-h-[150px] items-center justify-center overflow-hidden rounded-[0.9rem] border border-[rgba(93,126,194,0.12)] bg-[linear-gradient(180deg,#0f1724,#111b29)]">
                                <Image
                                  alt={item.title}
                                  className="object-contain p-4 group-hover:scale-110 transition duration-500"
                                  fill
                                  sizes="(max-width: 1280px) 100vw, 33vw"
                                  src={item.imageUrl}
                                  unoptimized
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 px-5 pb-5">
                          <h3 className="font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                            {item.title}
                          </h3>
                          <p className="text-sm leading-7 text-[color:var(--text-secondary)] line-clamp-2">
                            {item.description}
                          </p>
                          <Link
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[color:var(--accent)]"
                            href={`/services/${item.slug}`}
                          >
                            Explore Protocol →
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No Related Ecosystems"
                    description="As you expand your service directory, complementary modules will synchronize here."
                  />
                )}
              </div>

              <div className="space-y-6">
                <SectionIntro
                  eyebrow="Initiate Mission"
                  title="Ready to engineer your next digital platform?"
                  description="Leverage our strategic alignment channel to discuss the specific operational scope of your project."
                />
                <LeadCaptureForm defaultService={service.title} />
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
