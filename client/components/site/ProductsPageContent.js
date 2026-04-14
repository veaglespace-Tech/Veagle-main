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
  Eyebrow,
  PrimaryLink,
  SecondaryLink,
  containerClass,
  ctaShellClass,
  filterButtonClass,
  pageClass,
  pageHeroTitleClass,
  primaryButtonClass,
  sectionClass,
} from "@/components/site/UiBits";
import { cn, slugify } from "@/lib/utils";
import { pageArtwork } from "@/lib/visuals";

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
    "We build solution catalogs, product showcases and inquiry-ready business pages that are easier for users to understand and easier for your team to manage.";

  return (
    <main className={pageClass}>
      <header className={`${sectionClass} !pt-32 !pb-14 relative overflow-hidden`}>
        <div className="absolute inset-0 z-0">
          <Image
            src={pageArtwork.hero}
            alt="Products background"
            fill
            className="object-cover opacity-20 grayscale"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--page-bg)]/60 via-[color:var(--page-bg)]/80 to-[color:var(--page-bg)]" />
        </div>

        <div className="veagle-section-wash" />
        <div className="veagle-grid-background" />

        <div className={`${containerClass} relative z-10 flex flex-col items-center text-center`}>
          <div className="max-w-4xl space-y-8">
            <div className="flex flex-col items-center space-y-6">
              <Eyebrow>
                {pageContent.eyebrow || "Solution Architecture"}
              </Eyebrow>

              <div className="space-y-5">
                <h1 className={`${pageHeroTitleClass} text-white`}>
                  Website development, software, ERP, digital marketing
                  <br className="hidden lg:block" />
                  <span className="text-glow bg-gradient-to-r from-[#e7ecff] via-[#bcd0ff] to-[#56e240] bg-clip-text text-transparent">
                    and business support services in one place
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-[1.1rem] leading-8 text-white/80">
                  {pageContent.description ||
                    "Browse enterprise-grade product modules and digital solutions engineered to automate operations and accelerate growth."}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <Link
                  href="/contact"
                  className={cn(primaryButtonClass, "min-h-0 px-8 py-3.5")}
                >
                  Request a Quote
                </Link>
              </div>
            </div>
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
                No products published yet
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Add products from the dashboard to publish your live solution catalog here.
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
                Request a Quote
              </PrimaryLink>
              <SecondaryLink href="/contact">
                Discuss a Custom Solution
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
