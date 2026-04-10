"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Rocket } from "lucide-react";

import { backendAssetUrl } from "@/lib/backend";
import { pageArtwork } from "@/lib/visuals";

const cardLayouts = [
  "md:col-span-8 min-h-[360px] lg:min-h-[500px]",
  "md:col-span-4 min-h-[360px] lg:min-h-[500px]",
  "md:col-span-4 min-h-[300px] lg:min-h-[400px]",
  "md:col-span-8 min-h-[300px] lg:min-h-[400px]",
];

function normalizeCategory(category) {
  return (category || "").trim().toUpperCase();
}

function getCardLayout(index) {
  return cardLayouts[index % cardLayouts.length];
}

function getFocusStyles(index) {
  if (index % 4 === 0) {
    return {
      badge: "text-[#b7c9ff]",
      title: "text-white",
      copy: "text-[#c6d3ea]",
      overlay:
        "bg-[linear-gradient(180deg,rgba(6,10,17,0)_12%,rgba(7,11,18,0.92)_100%)]",
    };
  }

  if (index % 4 === 1) {
    return {
      badge: "text-[#ffc7d7]",
      title: "text-white",
      copy: "text-[#ced7ea]",
      overlay:
        "bg-[linear-gradient(180deg,rgba(6,10,17,0.06),rgba(6,10,17,0.94))]",
    };
  }

  if (index % 4 === 2) {
    return {
      badge: "text-[#8de379]",
      title: "text-white",
      copy: "text-[#c8d2e7]",
      overlay:
        "bg-[linear-gradient(180deg,rgba(6,10,17,0.02),rgba(6,10,17,0.94))]",
    };
  }

  return {
    badge: "text-[#9dd1ff]",
    title: "text-white",
    copy: "text-[#c8d2e7]",
    overlay:
      "bg-[linear-gradient(180deg,rgba(6,10,17,0.06),rgba(6,10,17,0.9))]",
  };
}

function protocolName(project) {
  const firstTag = project?.tags?.[0] || "CORE";
  return `${firstTag.slice(0, 3).toUpperCase()}-${String(project?.id || "01")
    .replace(/[^0-9]/g, "")
    .padStart(2, "0")}`;
}

function throughputValue(project) {
  const source = `${project?.title || ""} ${project?.result || ""}`.length;
  const value = 180 + (source % 320);
  return `+${value}%`;
}

function normalizeProject(project, index) {
  const tags = Array.isArray(project?.tags)
    ? project.tags
    : typeof project?.tags === "string"
      ? project.tags.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

  return {
    id: project?.id || `portfolio-${index + 1}`,
    title: project?.title || `Project ${index + 1}`,
    subtitle: project?.subtitle || "",
    result: project?.result || "",
    category: normalizeCategory(project?.category) || "PROJECT",
    imageUrl: project?.imageUrl || pageArtwork.services,
    summary: project?.summary || "",
    tags,
    linkUrl: project?.linkUrl || "",
    linkLabel: project?.linkLabel || "",
  };
}

function normalizeBackendProject(project, index) {
  const imageUrl = backendAssetUrl(project?.imageUrl) || pageArtwork.services;
  const linkUrl = project?.projectUrl || project?.githubUrl || "";
  const linkLabel = project?.projectUrl
    ? "Open project"
    : project?.githubUrl
      ? "View code"
      : "";

  return {
    id: project?.id || `portfolio-${index + 1}`,
    title: project?.title || `Project ${index + 1}`,
    subtitle: "",
    result: "",
    category: "PROJECT",
    imageUrl,
    summary: project?.description || "",
    tags: [],
    linkUrl,
    linkLabel,
  };
}

export default function PortfolioPageContent({ content, portfolioData = [] }) {
  const portfolio = content?.portfolio || {};
  const normalizedBackendProjects = Array.isArray(portfolioData)
    ? portfolioData.map((project, index) =>
        normalizeBackendProject(project, index)
      )
    : [];
  const projects = normalizedBackendProjects.length
    ? normalizedBackendProjects
    : Array.isArray(portfolio?.projects)
      ? portfolio.projects.map((project, index) =>
          normalizeProject(project, index)
        )
      : [];
  const filters = [
    "ALL",
    ...Array.from(
      new Set(projects.map((project) => normalizeCategory(project.category)).filter(Boolean))
    ),
  ];
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredProjects =
    activeFilter === "ALL"
      ? projects
      : projects.filter(
          (project) => normalizeCategory(project.category) === activeFilter
        );

  return (
    <main className="overflow-hidden bg-[#131314] text-[#e4e2e2]">
      <section className="relative flex min-h-[72vh] items-center justify-center overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="absolute inset-0">
          <Image
            src={pageArtwork.hero}
            alt="Portfolio orbital backdrop"
            fill
            priority
            className="object-cover opacity-35 grayscale"
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,18,0.48),rgba(8,11,18,0.9))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(179,197,255,0.2),transparent_35%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <span className="inline-flex items-center rounded-full border border-[#8aa5ff]/28 bg-[#1b2440]/55 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c4d4ff]">
            {portfolio.eyebrow || "Portfolio"}
          </span>
          <h1 className="mt-8 font-headline text-5xl font-black leading-[0.93] tracking-[-0.045em] text-white sm:text-7xl lg:text-8xl">
            {portfolio.title || "Project Showcase"}
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-[#c0cbe2] sm:text-lg">
            {portfolio.description ||
              "Publish your real case studies from the dashboard. This page now stays empty until portfolio entries are added."}
          </p>
        </div>
      </section>

      <section className="sticky top-20 z-40 border-y border-white/[0.05] bg-[#131314]/88 px-4 py-5 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter
                  ? "rounded-full bg-[#b3c5ff] px-8 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0f2e77]"
                  : "rounded-full bg-[#22252d] px-8 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9da7bc] transition hover:bg-[#2b2f38] hover:text-white"
              }
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-12 lg:gap-6">
          {filteredProjects.map((study, index) => {
            const styles = getFocusStyles(index);
            const isLargeLead = index % 4 === 0;
            const isTall = index % 4 === 1;
            const isCompact = index % 4 === 2;
            const isWideStat = index % 4 === 3;

            return (
              <article
                key={study.id}
                className={`group relative overflow-hidden rounded-[1.1rem] border border-white/8 bg-[#1a1d23] ${getCardLayout(index)}`}
              >
                <Image
                  src={study.imageUrl}
                  alt={study.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 40vw"
                  className="object-cover opacity-55 transition duration-700 group-hover:scale-105"
                />

                <div className={`absolute inset-0 ${styles.overlay}`} />

                {isLargeLead ? (
                  <div className="absolute right-5 top-5 rounded-full border border-white/14 bg-[#1f2634]/70 px-4 py-2 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[#56e240]" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#dce6ff]">
                        Protocol: {protocolName(study)}
                      </span>
                    </div>
                  </div>
                ) : null}

                <div
                  className={`absolute bottom-0 left-0 right-0 ${isCompact ? "p-6" : "p-7 sm:p-8"}`}
                >
                  {isLargeLead ? (
                    <p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${styles.badge}`}>
                      {study.subtitle || "Industrial Intelligence"}
                    </p>
                  ) : null}

                  {!isLargeLead ? (
                    <p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${styles.badge}`}>
                      {study.category}
                    </p>
                  ) : null}

                  <h2
                    className={`mt-2 font-headline font-black tracking-tight ${styles.title} ${
                      isCompact ? "text-[1.65rem]" : "text-[1.95rem] sm:text-[2.25rem]"
                    }`}
                  >
                    {study.title}
                  </h2>

                  <p className={`mt-3 max-w-2xl text-sm leading-7 ${styles.copy}`}>
                    {study.summary}
                  </p>

                  {isLargeLead ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(study.tags || []).slice(0, 2).map((tag) => (
                        <span
                          key={`${study.id}-${tag}`}
                          className="rounded-full border border-white/14 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d2dcf0]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {isTall ? (
                    <Link
                      href="/contact"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-[#b3c5ff]/32 bg-[#1d2844]/55 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#d4dfff] transition hover:bg-[#263967]"
                    >
                      Orbit Details
                    </Link>
                  ) : null}

                  {isCompact ? (
                    study.linkUrl ? (
                      <a
                        href={study.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c9d7ff]"
                      >
                        {study.linkLabel || "View Case Study"}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#c9d7ff]">
                        View Case Study
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    )
                  ) : null}

                  {isWideStat ? (
                    <div className="mt-6 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0">
                      <div className="w-fit rounded-[1rem] border border-white/14 bg-[#1f2634]/72 px-5 py-4 text-center backdrop-blur-md">
                        <p className="font-headline text-3xl font-black tracking-tight text-[#dbe4ff]">
                          {throughputValue(study)}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9dabc6]">
                          Throughput boost
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}

          {!filteredProjects.length ? (
            <div className="md:col-span-12 rounded-[1.2rem] border border-dashed border-white/14 bg-[#1a1d23] px-6 py-14 text-center">
              <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                No portfolio projects yet
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#b7c3d9]">
                Add portfolio entries from the dashboard CMS and they will appear here automatically.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-[linear-gradient(135deg,#2a2e37,#1d2129)] px-6 py-14 text-center sm:px-10 lg:px-16 lg:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(179,197,255,0.2),transparent_45%)]" />
            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="font-headline text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                {portfolio.ctaTitle || "Ready to publish your next project story?"}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#c4cee1] sm:text-base">
                {portfolio.ctaDescription ||
                  "Use the dashboard CMS to add real portfolio data instead of hardcoded showcase cards."}
              </p>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-[#2d69e8] px-8 py-3.5 text-sm font-bold text-white transition hover:brightness-110"
                >
                  Create your next launch
                  <Rocket className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
