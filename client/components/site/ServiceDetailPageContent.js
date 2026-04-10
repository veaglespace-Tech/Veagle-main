import Image from "next/image";
import Link from "next/link";

import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import {
  Chip,
  Eyebrow,
  Panel,
  PrimaryLink,
  SectionIntro,
  containerClass,
  firstSectionClass,
  mutedCardClass,
  pageClass,
  sectionClass,
} from "@/components/site/UiBits";

export default function ServiceDetailPageContent({ service, relatedServices }) {
  return (
    <main className={pageClass}>
      <section className={firstSectionClass}>
        <div className={`${containerClass} grid gap-10 xl:grid-cols-[0.94fr_1.06fr] xl:items-center`}>
          <div className="space-y-6">
            <Eyebrow>Service detail</Eyebrow>
            <h1 className="font-headline text-5xl font-black tracking-tighter text-[color:var(--text-primary)] sm:text-6xl">
              {service.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
              {service.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {(service.features || []).map((feature) => (
                <Chip key={feature.id || feature.name}>{feature.name}</Chip>
              ))}
            </div>
            <PrimaryLink href="/contact">Discuss this service</PrimaryLink>
          </div>

          <Panel className="overflow-hidden p-0">
            <div className="bg-[linear-gradient(135deg,rgba(25,94,226,0.16),rgba(86,226,64,0.06))] p-6">
              <div className="relative flex h-[340px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-[#0f151e] sm:h-[420px]">
                <Image
                  alt={service.title}
                  src={service.imageUrl}
                  fill
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  className="object-contain p-8"
                  unoptimized
                />
              </div>
            </div>
          </Panel>
        </div>
      </section>

      <section className={sectionClass}>
        <div className={`${containerClass} grid gap-8 xl:grid-cols-[0.9fr_1.1fr]`}>
          <SectionIntro
            eyebrow="What is included"
            title="A clearer breakdown of scope, features and business value"
            description="This page is designed to keep the buyer focused on scope, proof and next step instead of scattered content."
          />
          <div className="grid gap-4">
            {(service.features || []).map((feature, index) => (
              <div key={feature.id || feature.name} className={mutedCardClass}>
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--accent)] text-sm font-black text-white">
                    0{index + 1}
                  </div>
                  <div>
                    <h2 className="font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
                      {feature.name}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">
                      This block can expand later with richer service-level copy while staying inside the current dynamic structure.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-28">
        <div className={`${containerClass} grid gap-8 xl:grid-cols-[0.98fr_1.02fr] xl:items-start`}>
          <div className="space-y-6">
            <SectionIntro
              eyebrow="Related services"
              title="Give visitors one more relevant path instead of a dead end"
              description="Related services help increase discovery and time on site without making the page feel overloaded."
            />
            <div className="grid gap-4">
              {relatedServices.map((item) => (
                <Panel key={item.slug}>
                  <h3 className="font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{item.description}</p>
                  <Link
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[color:var(--accent)]"
                    href={`/services/${item.slug}`}
                  >
                    View service
                  </Link>
                </Panel>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <SectionIntro
              eyebrow="Get started"
              title="Share your requirement and we will shape the right scope"
              description="Use this form to start the discussion with the service already selected."
            />
            <LeadCaptureForm defaultService={service.title} />
          </div>
        </div>
      </section>
    </main>
  );
}
