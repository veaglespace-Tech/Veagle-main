import Image from "next/image";
import { ArrowRight, Cpu, Landmark, Sparkles } from "lucide-react";

import {
  PrimaryLink,
  SecondaryLink,
  containerClass,
  ctaShellClass,
  pageClass,
} from "@/components/site/UiBits";
import { resolveClientProfile } from "@/lib/fallback-data";
import { COMPANY_NAME } from "@/lib/site";

const financeMatchers = [
  "bank",
  "finance",
  "hsbc",
  "hdfc",
  "idbi",
  "state bank",
  "axis",
  "au small",
  "poket cash",
];

const technologyMatchers = [
  "zoho",
  "smartual",
  "amazon",
  "upfyve",
  "indigo",
];

const groupMeta = {
  partners: {
    title: "Strategic Partners",
    description:
      `Primary delivery partners, business brands and growth-driven organizations connected with ${COMPANY_NAME}.`,
    icon: Sparkles,
    mode: "featured",
  },
  finance: {
    title: "Financial Institutions",
    description:
      "Trusted names across finance, lending, banking and service ecosystems where credibility matters the most.",
    icon: Landmark,
    mode: "compact",
  },
  technology: {
    title: "Technology Allies",
    description:
      "Platform, product and digital ecosystem partners helping power modern software, automation and operations.",
    icon: Cpu,
    mode: "wide",
  },
};

function normalizeClients(items = []) {
  return items
    .map(resolveClientProfile)
    .filter((item) => item?.name && item?.href);
}

function resolveGroupKey(name = "") {
  const normalized = name.toLowerCase();

  if (financeMatchers.some((matcher) => normalized.includes(matcher))) {
    return "finance";
  }

  if (technologyMatchers.some((matcher) => normalized.includes(matcher))) {
    return "technology";
  }

  return "partners";
}

function groupClients(items = []) {
  const grouped = {
    partners: [],
    finance: [],
    technology: [],
  };

  items.forEach((item) => {
    grouped[resolveGroupKey(item.name)].push(item);
  });

  return grouped;
}

function buildClientSummary(client, groupKey) {
  if (groupKey === "finance") {
    return "Trusted for finance-oriented visibility, service communication and secure digital operations.";
  }

  if (groupKey === "technology") {
    return "Aligned with product workflows, platform delivery and modern business system experiences.";
  }

  return "Part of the wider Veagle delivery network for websites, growth systems and day-to-day business execution.";
}

function LogoBadge({ client, size = "large" }) {
  const wrapClass =
    size === "small"
      ? "h-16 w-full rounded-[1.2rem]"
      : size === "wide"
        ? "h-20 w-20 rounded-[1.35rem]"
        : "h-16 w-16 rounded-[1.2rem]";

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-white/95 ${wrapClass}`}
    >
      {client.image ? (
        <Image
          src={client.image}
          alt={`${client.name} logo`}
          width={size === "wide" ? 96 : 144}
          height={size === "wide" ? 96 : 72}
          className="h-full w-full object-contain p-3"
          unoptimized
        />
      ) : (
        <span className="px-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#0d172f]">
          {client.name}
        </span>
      )}
    </div>
  );
}

function FeaturedClientCard({ client }) {
  return (
    <a
      href={client.href}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col rounded-[1.9rem] bg-[rgba(18,22,30,0.72)] p-6 shadow-[0_26px_80px_-44px_rgba(0,0,0,0.9)] ring-1 ring-white/6 backdrop-blur-[14px] transition duration-300 hover:-translate-y-1 hover:bg-[rgba(24,30,42,0.88)]"
    >
      <div className="flex items-start justify-between gap-4">
        <LogoBadge client={client} />
        <span className="rounded-full bg-[#56e240]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#78ff5f]">
          Connected
        </span>
      </div>
      <h3 className="mt-10 font-headline text-2xl font-black tracking-tight text-white">
        {client.name}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[#b6c1d8]">
        {buildClientSummary(client, "partners")}
      </p>
      <div className="mt-auto pt-8 text-xs font-bold uppercase tracking-[0.22em] text-[#9fb7ff]">
        Open Client Profile
        <ArrowRight className="ml-2 inline h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </a>
  );
}

function CompactClientCard({ client }) {
  return (
    <a
      href={client.href}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-[13rem] flex-col items-center justify-center rounded-[1.6rem] bg-[rgba(24,27,34,0.92)] p-5 text-center transition duration-300 hover:bg-[rgba(31,36,46,0.96)]"
    >
      <LogoBadge client={client} size="small" />
      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c0cadf]">
        {client.name}
      </p>
    </a>
  );
}

function WideClientCard({ client }) {
  return (
    <a
      href={client.href}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full items-center gap-5 rounded-[1.9rem] bg-[rgba(18,22,30,0.72)] p-6 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.85)] ring-1 ring-white/6 backdrop-blur-[14px] transition duration-300 hover:-translate-y-1 hover:bg-[rgba(24,30,42,0.88)]"
    >
      <div className="shrink-0">
        <LogoBadge client={client} size="wide" />
      </div>
      <div className="min-w-0">
        <h3 className="font-headline text-2xl font-black tracking-tight text-white">
          {client.name}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#b6c1d8]">
          {buildClientSummary(client, "technology")}
        </p>
      </div>
      <ArrowRight className="ml-auto hidden h-5 w-5 shrink-0 text-[#9fb7ff] transition group-hover:translate-x-1 sm:block" />
    </a>
  );
}

function GroupSection({ sectionKey, items }) {
  if (!items.length) {
    return null;
  }

  const meta = groupMeta[sectionKey];
  const Icon = meta.icon;

  return (
    <section className="py-16 sm:py-20">
      <div className={containerClass}>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9fb7ff]">
              Client Network
            </p>
            <h2 className="mt-4 font-headline text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
              {meta.title}
            </h2>
            <p className="mt-3 text-sm leading-8 text-[#b5bfd3] sm:text-base">
              {meta.description}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-[rgba(22,28,40,0.92)] text-[#9fb7ff] ring-1 ring-white/8">
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {meta.mode === "featured" ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {items.map((client) => (
              <FeaturedClientCard key={client.name} client={client} />
            ))}
          </div>
        ) : null}

        {meta.mode === "compact" ? (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {items.map((client) => (
              <CompactClientCard key={client.name} client={client} />
            ))}
          </div>
        ) : null}

        {meta.mode === "wide" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {items.map((client) => (
              <WideClientCard key={client.name} client={client} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function ClientsPageContent({ content }) {
  const clients = content?.clients || {};
  const logos =
    Array.isArray(clients?.logos) && clients.logos.length ? clients.logos : [];
  const normalizedClients = normalizeClients(logos);
  const groupedClients = groupClients(normalizedClients);
  const proof = Array.isArray(clients?.proof) ? clients.proof.slice(0, 3) : [];
  const segments = Array.isArray(clients?.segments) ? clients.segments : [];
  const hasClientCards = normalizedClients.length > 0;

  const heroProof =
    proof.length > 0
      ? proof
      : [
          { label: "Connected logos", value: `${normalizedClients.length}+` },
          { label: "Delivery focus", value: hasClientCards ? "Live showcase" : "Waiting for data" },
          { label: "Brand trust", value: hasClientCards ? "Portfolio-backed" : "Add client proofs" },
        ];

  return (
    <main className={pageClass}>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(25,94,226,0.18),transparent_26%),linear-gradient(180deg,rgba(11,14,20,0.2),rgba(11,13,18,0.9))]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(25,94,226,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(25,94,226,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className={`relative z-10 ${containerClass}`}>
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3257b8]/40 bg-[#1a2240]/45 px-4 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#56e240] shadow-[0_0_14px_rgba(86,226,64,0.55)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b3c5ff]">
                Client Network Active
              </span>
            </div>

            <h1 className="mx-auto mt-8 max-w-4xl font-headline text-4xl font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              {clients.title || "Built for businesses that need clarity, confidence and real digital momentum"}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#b8c3d8] sm:text-lg">
              {clients.description ||
                `${COMPANY_NAME} works with growth brands, financial institutions and technology teams that need a more dependable digital presentation.`}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8f9ab3]">
              <span>{normalizedClients.length}+ connected client identities</span>
              <span className="hidden h-px w-12 bg-white/12 sm:block" />
              <span>{segments.length || 3} focus sectors across operations</span>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3">
            {heroProof.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="rounded-[1.65rem] bg-[rgba(19,23,31,0.72)] px-5 py-6 text-left shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/6 backdrop-blur-[14px]"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8f9ab3]">
                  {item.label}
                </p>
                <p className="mt-3 font-headline text-2xl font-black tracking-tight text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {hasClientCards ? (
        <>
          <GroupSection sectionKey="partners" items={groupedClients.partners} />
          <GroupSection sectionKey="finance" items={groupedClients.finance} />
          <GroupSection sectionKey="technology" items={groupedClients.technology} />
        </>
      ) : (
        <section className="pb-16 sm:pb-20">
          <div className={containerClass}>
            <div className="rounded-[2rem] bg-[rgba(14,18,26,0.8)] p-8 text-center shadow-[0_28px_80px_-48px_rgba(0,0,0,0.88)] ring-1 ring-white/6 backdrop-blur-[14px]">
              <h2 className="font-headline text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                No client showcase entries yet
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-[#b5bfd3] sm:text-base">
                Add client logos and links from the dashboard CMS to publish this page without any hardcoded data.
              </p>
            </div>
          </div>
        </section>
      )}

      {segments.length ? (
        <section className="pb-16 sm:pb-20">
          <div className={containerClass}>
            <div className="rounded-[2rem] bg-[rgba(14,18,26,0.8)] p-6 shadow-[0_28px_80px_-48px_rgba(0,0,0,0.88)] ring-1 ring-white/6 backdrop-blur-[14px] sm:p-8">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#9fb7ff]">
                  Network sectors
                </p>
                <h2 className="mt-4 font-headline text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                  Where this client network performs best
                </h2>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {segments.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.55rem] bg-[rgba(24,29,37,0.92)] p-5 transition duration-300 hover:bg-[rgba(29,35,46,0.96)]"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8f9ab3]">
                      Sector focus
                    </p>
                    <h3 className="mt-4 font-headline text-2xl font-black tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#b8c3d8]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div
            className={`${ctaShellClass} relative overflow-hidden bg-[linear-gradient(180deg,rgba(16,21,31,0.92),rgba(10,13,19,0.98))] px-6 py-12 text-center shadow-[0_30px_90px_-54px_rgba(0,0,0,0.9)] ring-1 ring-white/8 sm:px-10 lg:px-16`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(25,94,226,0.18),transparent_32%),linear-gradient(180deg,transparent,rgba(8,10,15,0.34))]" />
            <div className="relative z-10">
              <h2 className="mx-auto max-w-4xl font-headline text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-5xl">
                {clients.ctaTitle || "Want your client story to feel more credible online?"}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#b8c3d8]">
                {clients.ctaDescription ||
                  "We can turn partner logos, sectors and service credibility into a stronger public trust layer without making the website feel crowded."}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <PrimaryLink href="/contact">Build the showcase</PrimaryLink>
                <SecondaryLink href="/portfolio">View portfolio</SecondaryLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
