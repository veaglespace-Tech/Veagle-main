import Image from "next/image";
import { ArrowRight, Cpu, Landmark, Sparkles } from "lucide-react";

import {
  PrimaryLink,
  SecondaryLink,
  containerClass,
  ctaShellClass,
  pageClass,
  pageHeroTitleClass,
} from "@/components/site/UiBits";
import { resolveClientProfile } from "@/lib/fallback-data";
import { backendAssetUrl } from "@/lib/backend";
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
    title: "Strategic Partnerships",
    description:
      `Businesses and brands that value clear delivery, strong digital presentation and dependable execution from ${COMPANY_NAME}.`,
    icon: Sparkles,
    mode: "featured",
  },
  finance: {
    title: "Financial Ecosystems",
    description:
      "Finance-oriented teams and institutions that need dependable presentation, process clarity and secure digital workflows.",
    icon: Landmark,
    mode: "compact",
  },
  technology: {
    title: "Technological Alliances",
    description:
      "Technology-led organizations that need scalable websites, software support and cleaner customer-facing experiences.",
    icon: Cpu,
    mode: "wide",
  },
};

function normalizeClients(items = []) {
  return items
    .map(resolveClientProfile)
    .filter((item) => item?.name);
}

function normalizeBackendClients(items = []) {
  return items
    .map((client) => ({
      name: client?.name || "",
      href: client?.websiteUrl || "",
      image: backendAssetUrl(client?.logoUrl),
      description: client?.description || "",
    }))
    .filter((item) => item.name);
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
    return "Supporting finance-focused teams with better digital presentation, structured workflows and dependable software support.";
  }

  if (groupKey === "technology") {
    return "Helping digital and technology-led teams improve product presentation, workflow clarity and scalable execution.";
  }

  return "Helping service brands and business teams create stronger websites, clearer communication and smoother digital operations.";
}

function ClientCardShell({ client, className, children }) {
  if (client.href) {
    return (
      <a href={client.href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return <div className={className}>{children}</div>;
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
        <span className="px-4 text-center text-[10px] font-black uppercase tracking-[0.18em] text-[color:var(--page-bg)]">
          {client.name}
        </span>
      )}
    </div>
  );
}

function FeaturedClientCard({ client }) {
  return (
    <ClientCardShell
      client={client}
      className="group flex h-full flex-col rounded-[1.9rem] bg-[color:var(--surface)] p-6 shadow-[0_26px_80px_-44px_rgba(0,0,0,0.9)] ring-1 ring-white/6 backdrop-blur-[14px] transition duration-300 hover:-translate-y-1 hover:bg-[color:var(--surface-strong)]"
    >
      <div className="flex items-start justify-between gap-4">
        <LogoBadge client={client} />
        <span className="rounded-full bg-[color:var(--accent-success)]/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--accent-success)]">
          Active
        </span>
      </div>
      <h3 className="mt-10 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
        {client.name}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
        {buildClientSummary(client, "partners")}
      </p>
      <div className="mt-auto pt-8 text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--accent)] group-hover:text-[color:var(--text-primary)]">
        Client Profile
        <ArrowRight className="ml-2 inline h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </ClientCardShell>
  );
}

function CompactClientCard({ client }) {
  return (
    <ClientCardShell
      client={client}
      className="group flex min-h-[13rem] flex-col items-center justify-center rounded-[1.6rem] bg-[color:var(--surface)] p-5 text-center transition duration-300 hover:bg-[color:var(--surface-strong)] hover:scale-[1.02]"
    >
      <LogoBadge client={client} size="small" />
      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--text-muted)] group-hover:text-[color:var(--text-primary)]">
        {client.name}
      </p>
    </ClientCardShell>
  );
}

function WideClientCard({ client }) {
  return (
    <ClientCardShell
      client={client}
      className="group flex h-full items-center gap-5 rounded-[1.9rem] bg-[color:var(--surface)] p-6 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.85)] ring-1 ring-white/6 backdrop-blur-[14px] transition duration-300 hover:-translate-y-1 hover:bg-[color:var(--surface-strong)]"
    >
      <div className="shrink-0">
        <LogoBadge client={client} size="wide" />
      </div>
      <div className="min-w-0">
        <h3 className="font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
          {client.name}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
          {buildClientSummary(client, "technology")}
        </p>
      </div>
      <ArrowRight className="ml-auto hidden h-5 w-5 shrink-0 text-[color:var(--accent)] transition group-hover:translate-x-1 group-hover:text-[color:var(--text-primary)] sm:block" />
    </ClientCardShell>
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
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[color:var(--accent)]">
              Industries We Support
            </p>
            <h2 className="mt-4 font-headline text-3xl font-black tracking-[-0.03em] text-[color:var(--text-primary)] sm:text-4xl">
              {meta.title}
            </h2>
            <p className="mt-3 text-[15px] leading-8 text-[color:var(--text-secondary)]">
              {meta.description}
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-[color:var(--surface-strong)] text-[color:var(--accent)] ring-1 ring-white/8 shadow-[0_0_20px_rgba(25,94,226,0.1)]">
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

export default function ClientsPageContent({ content, clientsData = [] }) {
  const clients = content?.clients || {};
  const backendClients = Array.isArray(clientsData) ? clientsData : [];
  const backendLogos = normalizeBackendClients(backendClients);
  const logos =
    backendLogos.length
      ? backendLogos
      : Array.isArray(clients?.logos) && clients.logos.length
        ? clients.logos
        : [];
  const normalizedClients = normalizeClients(logos);
  const groupedClients = groupClients(normalizedClients);
  const proof = Array.isArray(clients?.proof) ? clients.proof.slice(0, 3) : [];
  const segments = Array.isArray(clients?.segments) ? clients.segments : [];
  const hasClientCards = normalizedClients.length > 0;

  const heroProof =
    proof.length > 0
      ? proof
      : [
          { label: "Active Integrations", value: `${normalizedClients.length}+` },
          { label: "Operational Context", value: hasClientCards ? "Live Protocol" : "Standby" },
          { label: "Delivery Tier", value: hasClientCards ? "Enterprise Ready" : "Initializing" },
        ];

  return (
    <main className={pageClass}>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(25,94,226,0.18),transparent_26%),linear-gradient(180deg,rgba(11,14,20,0.2),rgba(11,13,18,0.9))]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(25,94,226,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(25,94,226,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />

        <div className={`relative z-10 ${containerClass}`}>
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--surface-strong)] px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[color:var(--accent-success)] shadow-[0_0_14px_rgba(86,226,64,0.4)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                Client and industry coverage
              </span>
            </div>

            <h1 className={`mx-auto mt-8 max-w-4xl ${pageHeroTitleClass} text-white`}>
              {clients.title || "Supporting brands, business teams and digital-first companies with practical technology solutions"}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[color:var(--text-secondary)]">
              {clients.description ||
                `${COMPANY_NAME} helps businesses improve websites, software workflows and digital communication through practical, user-friendly delivery.`}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
              <span>{normalizedClients.length}+ client references</span>
              <span className="hidden h-px w-12 bg-white/12 sm:block" />
              <span>{segments.length || 3} industry segments</span>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3">
            {heroProof.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="rounded-[1.65rem] bg-[color:var(--surface)] px-5 py-6 text-left shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/6 backdrop-blur-[14px]"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                  {item.label}
                </p>
                <p className="mt-3 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
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
            <div className="rounded-[2rem] bg-[color:var(--surface)] p-8 text-center shadow-[0_28px_80px_-48px_rgba(0,0,0,0.88)] ring-1 ring-white/6 backdrop-blur-[14px]">
              <h2 className="font-headline text-3xl font-black tracking-[-0.03em] text-[color:var(--text-primary)] sm:text-4xl">
                Client references are being updated
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-[color:var(--text-secondary)]">
                Add client logos and links from the administrative dashboard to publish this section.
              </p>
            </div>
          </div>
        </section>
      )}

      {segments.length ? (
        <section className="pb-16 sm:pb-20">
          <div className={containerClass}>
            <div className="rounded-[2rem] bg-[color:var(--surface)] p-6 shadow-[0_28px_80px_-48px_rgba(0,0,0,0.88)] ring-1 ring-white/6 backdrop-blur-[14px] sm:p-8">
              <div className="max-w-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[color:var(--accent)]">
                  Industry Focus
                </p>
                <h2 className="mt-4 font-headline text-3xl font-black tracking-[-0.03em] text-[color:var(--text-primary)] sm:text-4xl">
                  Where We Add Value
                </h2>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {segments.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.55rem] bg-[color:var(--surface-strong)] p-5 transition duration-300 hover:bg-[color:var(--accent)]/10"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                      Segment
                    </p>
                    <h3 className="mt-4 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
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
            className={`${ctaShellClass} relative overflow-hidden bg-[color:var(--page-bg-soft)] px-6 py-12 text-center shadow-[0_30px_90px_-54px_rgba(0,0,0,0.9)] ring-1 ring-white/8 sm:px-10 lg:px-16`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(25,94,226,0.18),transparent_32%),linear-gradient(180deg,transparent,rgba(8,10,15,0.34))]" />
            <div className="relative z-10">
              <h2 className="mx-auto max-w-4xl font-headline text-3xl font-black leading-tight tracking-[-0.035em] text-white sm:text-5xl">
                {clients.ctaTitle || "Need a partner for stronger websites, smoother software and better digital visibility?"}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[color:var(--text-secondary)]">
                {clients.ctaDescription ||
                  "Talk to Veagle Space about building a business-ready digital presence that supports both customers and internal teams."}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <PrimaryLink href="/contact">Start a Conversation</PrimaryLink>
                <SecondaryLink href="/portfolio">View Portfolio</SecondaryLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
