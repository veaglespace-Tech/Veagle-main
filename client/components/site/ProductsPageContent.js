"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Cpu,
  Landmark,
  Network,
  RadioTower,
  Satellite,
  Shield,
  TerminalSquare,
} from "lucide-react";

import {
  PrimaryLink,
  SecondaryLink,
  ctaShellClass,
  filterButtonClass,
  pageClass,
} from "@/components/site/UiBits";
import { pageArtwork } from "@/lib/visuals";
import { slugify } from "@/lib/utils";

const categoryAllId = "ALL_SOLUTIONS";

const iconMatchers = [
  { pattern: /(data|entry|ingest|validation)/i, icon: TerminalSquare },
  { pattern: /(zoho|suite|platform|crm|erp)/i, icon: Network },
  { pattern: /(bank|finance|loan|insurance|payment)/i, icon: Landmark },
  { pattern: /(digital|token|mobile|app|cloud|ai)/i, icon: Cpu },
  { pattern: /(analysis|analytics|report|insight)/i, icon: BarChart3 },
  { pattern: /(ground|station|antenna|router|network)/i, icon: RadioTower },
  { pattern: /(threat|defense|security|protect)/i, icon: Shield },
  { pattern: /(satellite|fleet|constellation|orbit)/i, icon: Satellite },
];

function normalize(value = "") {
  return value.trim().toLowerCase();
}

function resolveProductIcon(product) {
  const text = `${product?.title || ""} ${product?.description || ""} ${
    product?.categoryName || ""
  }`;
  return iconMatchers.find((entry) => entry.pattern.test(text))?.icon || Cpu;
}

function resolveStatus(product, index) {
  const text = `${product?.title || ""} ${product?.description || ""} ${
    product?.categoryName || ""
  }`.toLowerCase();

  if (product?.isActive === false) {
    return {
      label: "INACTIVE",
      className: "bg-rose-500/20 text-rose-200",
    };
  }

  if (/(bank|finance|loan|insurance)/i.test(text)) {
    return {
      label: "ENCRYPTED",
      className: "bg-[color:var(--accent-success)]/15 text-[color:var(--accent-success)]",
    };
  }

  if (/(zoho|platform|suite|erp|business)/i.test(text)) {
    return {
      label: "PLATFORM",
      className: "bg-[#3a4151] text-[color:var(--text-secondary)]",
    };
  }

  if (/(digital|token|mobile|app|cloud|ai|next)/i.test(text)) {
    return {
      label: "NEXT GEN",
      className: "bg-[#ffb1c5]/16 text-[#ffd2de]",
    };
  }

  return {
    label: `v${index + 1}.STABLE`,
    className: "bg-[color:var(--accent-success)]/15 text-[color:var(--accent-success)]",
  };
}

function buildCatalog(products, categories) {
  const normalizedProducts = Array.isArray(products) ? products : [];
  const baseCategories = Array.isArray(categories)
    ? categories
        .filter((item) => item?.name)
        .map((item) => ({
          id: item.id || item.name,
          name: item.name,
          description: item.description || "",
        }))
    : [];

  const seen = new Set(baseCategories.map((item) => normalize(item.name)));
  const dynamicCategories = [];

  normalizedProducts.forEach((product) => {
    const categoryName = (product?.categoryName || "").trim();
    if (!categoryName) {
      return;
    }
    const key = normalize(categoryName);
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    dynamicCategories.push({
      id: `dynamic-${categoryName}`,
      name: categoryName,
      description: "",
    });
  });

  const mergedCategories = [...baseCategories, ...dynamicCategories];
  const groups = mergedCategories.map((category) => ({
    ...category,
    items: normalizedProducts.filter(
      (product) =>
        normalize(product?.categoryName || "other") === normalize(category.name)
    ),
  }));

  const groupedKeys = new Set(
    mergedCategories.map((category) => normalize(category.name))
  );
  const uncategorized = normalizedProducts.filter(
    (product) =>
      !product?.categoryName ||
      !groupedKeys.has(normalize(product.categoryName))
  );

  if (uncategorized.length) {
    groups.push({
      id: "other",
      name: "Other",
      description: "Products without mapped category yet.",
      items: uncategorized,
    });
  }

  return groups;
}

function renderHeroTitle(value) {
  const title = value || "Enterprise Solutions & Software Systems";
  const marker = "solutions";
  const index = title.toLowerCase().indexOf(marker);

  if (index === -1) {
    return title;
  }

  const start = title.slice(0, index);
  const focus = title.slice(index, index + marker.length);
  const end = title.slice(index + marker.length);

  return (
    <>
      {start}
      <span className="text-[color:var(--accent)]">{focus}</span>
      {end}
    </>
  );
}

export default function ProductsPageContent({ products, categories, content }) {
  const pageContent = content?.productsPage || {};
  const catalogGroups = useMemo(
    () => buildCatalog(products, categories),
    [products, categories]
  );
  const categoryFilters = useMemo(
    () => [
      { id: categoryAllId, name: "All Solutions", description: "" },
      ...catalogGroups.map((group) => ({
        id: group.id || group.name,
        name: group.name,
        description: group.description || "",
      })),
    ],
    [catalogGroups]
  );
  const [activeFilter, setActiveFilter] = useState(categoryAllId);
  const deferredFilter = useDeferredValue(activeFilter);

  const filteredProducts = useMemo(() => {
    if (deferredFilter === categoryAllId) {
      return Array.isArray(products) ? products : [];
    }

    const selected = catalogGroups.find(
      (group) => group.id === deferredFilter || group.name === deferredFilter
    );

    return selected?.items || [];
  }, [deferredFilter, products, catalogGroups]);

  const activeFilterMeta = categoryFilters.find(
    (filter) => filter.id === deferredFilter
  );
  const ctaTitle =
    pageContent.ctaTitle || "Need a bespoke architectural configuration?";
  const ctaDescription =
    pageContent.ctaDescription ||
    "Our engineering labs specialize in building precision-engineered software layers for unique operational mission parameters.";

  return (
    <main className={pageClass}>
      <header className="relative overflow-hidden pb-20 pt-32">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--accent)]/20 to-transparent" />
          <Image
            src={pageArtwork.hero}
            alt="Products background"
            fill
            className="object-cover opacity-30 grayscale"
            priority
            unoptimized
          />
        </div>

        <div className="relative z-10 mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--surface-strong)] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
              Digital Fleet Catalog v2.6
            </span>
            <h1 className="mt-6 font-headline text-5xl font-black leading-[0.94] tracking-[-0.04em] text-white sm:text-7xl">
              {renderHeroTitle(pageContent.title)}
            </h1>
            <p className="mt-6 text-lg leading-8 text-[color:var(--text-secondary)]">
              {pageContent.description ||
                "Integrated software ecosystems for complex business operations, high-efficiency automation, and mission-critical financial workflows."}
            </p>
          </div>
        </div>
      </header>

      <section className="sticky top-20 z-40 border-y border-white/6 bg-[color:var(--page-bg)]/85 py-6 backdrop-blur-md">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categoryFilters.map((filter) => {
              const isActive = deferredFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`whitespace-nowrap font-black uppercase tracking-[0.14em] text-[10px] ${filterButtonClass(isActive)}`}
                >
                  {filter.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        {activeFilterMeta?.description ? (
          <p className="mb-6 text-sm leading-7 text-[color:var(--text-secondary)]">
            {activeFilterMeta.description}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => {
            const Icon = resolveProductIcon(product);
            const status = resolveStatus(product, index);
            const categoryName = product.categoryName || "General";
            const productSlug = product.slug || slugify(product.title);
            const hasImage = !!product.imageUrl;

            return (
              <Link
                key={product.id || `${product.title}-${index}`}
                href={`/products/${productSlug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1rem] border border-white/6 bg-[color:var(--surface)] backdrop-blur-[12px] transition duration-300 hover:-translate-y-1 hover:bg-[color:var(--surface-strong)] hover:border-white/14"
              >
                {/* Product image */}
                {hasImage ? (
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(15,18,26,0.7))]" />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-7 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--accent)]/10 text-[color:var(--accent)] transition duration-300 group-hover:scale-110 group-hover:bg-[color:var(--accent)] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <h3 className="font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                    {product.title}
                  </h3>
                  <p className="mt-4 flex-grow text-sm leading-7 text-[color:var(--text-secondary)]">
                    {product.description}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-white/5 pt-5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                      {categoryName}
                    </span>
                    <ArrowRight className="h-4.5 w-4.5 text-[color:var(--text-muted)] transition duration-300 group-hover:translate-x-1 group-hover:text-[color:var(--accent)]" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!filteredProducts.length ? (
          <div className="mt-8 rounded-[1rem] border border-dashed border-white/15 bg-[#1a1c21] px-6 py-12 text-center">
            <h3 className="font-headline text-2xl font-black tracking-tight text-white">
              Project Vault Empty
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
              Initialize your product catalog via the integrated dashboard to synchronize live solutions.
            </p>
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className={`relative overflow-hidden border border-white/10 bg-[linear-gradient(135deg,#182a59,#101a33)] p-8 shadow-[0_30px_90px_-44px_rgba(6,12,28,0.72)] sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-12 ${ctaShellClass}`}>
          <div className="absolute inset-0 opacity-15">
            <Image
              src={pageArtwork.hero}
              alt="CTA background"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="relative z-10 max-w-3xl">
            <h2 className="font-headline text-4xl font-black leading-[0.95] tracking-[-0.03em] text-white sm:text-5xl">
              {ctaTitle}
            </h2>
            <p className="mt-5 text-lg leading-8 text-[color:var(--text-secondary)]">{ctaDescription}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <PrimaryLink href="/contact">
                Initiate Protocol
              </PrimaryLink>
              <SecondaryLink href="/contact">
                Project Discovery
              </SecondaryLink>
            </div>
          </div>

          <div className="relative z-10 mt-12 hidden xl:block lg:mt-0">
            <div className="flex h-64 w-64 items-center justify-center rounded-full border border-white/15">
              <div className="flex h-48 w-48 items-center justify-center rounded-full border border-white/20">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10">
                  <Satellite className="h-14 w-14 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
