import Image from "next/image";
import { BriefcaseBusiness, Eye, Rocket, ShieldCheck } from "lucide-react";

import {
  PrimaryLink,
  SecondaryLink,
  ctaShellClass,
  pageClass,
} from "@/components/site/UiBits";
import { pageArtwork } from "@/lib/visuals";

const principleIcons = [BriefcaseBusiness, Eye, ShieldCheck];

function resolveHeading(value) {
  const title = value || "Practical Software, Business-Ready Delivery.";
  const marker = "business-ready delivery";
  const index = title.toLowerCase().indexOf(marker);

  if (index === -1) {
    return <>{title}</>;
  }

  const start = title.slice(0, index);
  const focus = title.slice(index, index + marker.length);
  const end = title.slice(index + marker.length);

  return (
    <>
      {start}
      <span className="bg-gradient-to-r from-[#72a9ff] to-[#2d6cff] bg-clip-text text-transparent">
        {focus}
      </span>
      {end}
    </>
  );
}

export default function AboutPageContent({ content }) {
  const about = content?.about || {};
  const milestones =
    Array.isArray(about?.milestones) && about.milestones.length
      ? about.milestones.slice(0, 3)
      : [];
  const pillars =
    Array.isArray(about?.pillars) && about.pillars.length
      ? about.pillars.slice(0, 3)
      : [];
  const workingModel =
    Array.isArray(about?.workingModel) && about.workingModel.length
      ? about.workingModel.slice(0, 4)
      : [];
  const heroDescription =
    about.description ||
    "Add about page content from the dashboard to describe your company, working model and proof points.";
  const missionLine = about.story || about.background;

  return (
    <main className={pageClass}>
      <section className="relative flex min-h-[78vh] items-center overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="absolute inset-0">
          <Image
            src={pageArtwork.about}
            alt="About company background"
            fill
            priority
            className="object-cover opacity-45"
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,16,24,0.96),rgba(12,16,24,0.8)_52%,rgba(12,16,24,0.42))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(30,115,255,0.22),transparent_35%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-screen-2xl">
          <div className="max-w-4xl text-center md:text-left">
            <h1 className="font-headline text-4xl font-black leading-[0.93] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              {resolveHeading(about.title)}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#bfcbdf] sm:text-lg">
              {heroDescription}
            </p>
            {missionLine ? (
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#aebad2]">
                {missionLine}
              </p>
            ) : null}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <PrimaryLink href="/services">
                Explore Our Tech
              </PrimaryLink>
              <SecondaryLink href="/contact">
                Mission Protocol
              </SecondaryLink>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#131314] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-screen-2xl gap-6 md:grid-cols-3">
          {milestones.length ? (
            milestones.map((item) => (
              <article
                key={item.label}
                className="rounded-[1.05rem] bg-[#1d2129] p-7 transition hover:bg-[#222732]"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6fa0ff]">
                  {item.label}
                </p>
                <h2 className="mt-4 font-headline text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {item.value}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#b9c5dd]">{item.detail}</p>
              </article>
            ))
          ) : (
            <article className="rounded-[1.05rem] border border-dashed border-white/12 bg-[#1d2129] p-7 text-center md:col-span-3">
              <h2 className="font-headline text-2xl font-black tracking-tight text-white">
                No milestone data yet
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#b9c5dd]">
                Add about milestones from the dashboard CMS and they will appear here automatically.
              </p>
            </article>
          )}
        </div>
      </section>

      <section className="bg-[#101216] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-headline text-4xl font-black tracking-tight text-white sm:text-5xl">
                Our Working Model
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#b2bed5] sm:text-base">
                {about.background ||
                  "We apply a step-ready engineering cycle that keeps every release stable, scalable and business aligned."}
              </p>
            </div>
            <div className="hidden h-[2px] w-20 bg-[#2d66e9] md:block" />
          </div>

          {workingModel.length ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
              {workingModel.map((step, index) => {
                const isAccent = index === 1;
                const isWide = index === 0 || index === 3;

                return (
                  <article
                    key={`working-model-${index + 1}`}
                    className={`relative overflow-hidden rounded-[1rem] p-8 lg:p-10 ${
                      isAccent ? "bg-[#2d66e9]" : "bg-[#1d2129]"
                    } ${isWide ? "md:col-span-8" : "md:col-span-4"}`}
                  >
                    <p className={`text-lg font-black ${isAccent ? "text-white/55" : "text-[#5f95ff]"}`}>
                      0{index + 1}
                    </p>
                    <h3 className="mt-7 font-headline text-3xl font-black tracking-tight text-white">
                      Step {index + 1}
                    </h3>
                    <p className={`relative z-10 mt-4 text-base leading-8 ${isAccent ? "text-[#dbe7ff]" : "text-[#b9c4da]"}`}>
                      {step}
                    </p>
                    {index === workingModel.length - 1 ? (
                      <div className="pointer-events-none absolute -bottom-6 right-2 opacity-[0.14]">
                        <Rocket className="h-32 w-32 text-white lg:h-40 lg:w-40" />
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[1rem] border border-dashed border-white/12 bg-[#1d2129] p-8 text-center">
              <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                No working model steps yet
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#b9c4da]">
                Add the about-page workflow from the dashboard CMS and this section will render automatically.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#131314] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-screen-2xl text-center">
          <h2 className="font-headline text-4xl font-black tracking-tight text-white sm:text-5xl">
            Core Principles
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#b4c0d8] sm:text-base">
            The three pillars that support every engagement.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-screen-2xl gap-5 md:grid-cols-3">
          {pillars.length ? (
            pillars.map((pillar, index) => {
              const Icon = principleIcons[index % principleIcons.length];

              return (
                <article
                  key={pillar.title}
                  className="flex flex-col items-center rounded-[1rem] border border-white/[0.06] bg-[#12161d] p-8 text-center transition hover:border-[#2d67eb]/40"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2d67eb]/18 text-[#71a1ff]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-7 font-headline text-2xl font-black tracking-tight text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#b8c4dc]">
                    {pillar.description}
                  </p>
                </article>
              );
            })
          ) : (
            <article className="rounded-[1rem] border border-dashed border-white/[0.12] bg-[#12161d] p-8 text-center md:col-span-3">
              <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                No principle cards yet
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#b8c4dc]">
                Add about-page pillars from the dashboard CMS to replace this empty state.
              </p>
            </article>
          )}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
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
                {about.ctaTitle || "Ready to add your company story?"}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-[#e0ebff] sm:text-lg">
                {about.ctaDescription ||
                  "Use the dashboard CMS to publish your about-page message, milestones and trust signals without touching code."}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <PrimaryLink href="/contact">
                  Initiate Contact
                </PrimaryLink>
                <SecondaryLink href="/services">
                  View Tech Stack
                </SecondaryLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
