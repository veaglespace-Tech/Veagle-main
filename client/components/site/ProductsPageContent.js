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
} from "@/components/site/UiBits";
import { slugify } from "@/lib/utils";
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
      className: "border border-rose-200 bg-white text-[#0c0e18]",
    };
  }

  if (/(bank|finance|loan|insurance)/i.test(text)) {
    return {
      label: "ENCRYPTED",
      className: "border border-emerald-200 bg-white text-[#0c0e18]",
    };
  }

  if (/(zoho|platform|suite|erp|business)/i.test(text)) {
    return {
      label: "PLATFORM",
      className: "border border-slate-200 bg-white text-[#0c0e18]",
    };
  }

  if (/(digital|token|mobile|app|cloud|ai|next)/i.test(text)) {
    return {
      label: "NEXT GEN",
      className: "border border-blue-200 bg-white text-[#0c0e18]",
    };
  }

  return {
    label: `v${index + 1}.STABLE`,
    className: "border border-emerald-200 bg-white text-[#0c0e18]",
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
      <header className="relative overflow-hidden bg-[#0c0e18] !pb-20 !pt-32">
        <div className="absolute inset-0 z-0">
          <Image
            src={pageArtwork.hero}
            alt="Products background"
            fill
            className="object-cover opacity-50 brightness-[0.4]"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e18]/90 via-[#0c0e18]/40 to-[#0c0e18]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0c0e18_100%)] opacity-80" />
        </div>

        <div className="veagle-section-wash" />
        <div className="veagle-grid-background pointer-events-none opacity-40" />

        <div className={`${containerClass} relative z-10 flex flex-col items-center text-center`}>
          <div className="max-w-4xl space-y-8">
            <div className="flex flex-col items-center space-y-6">
              <Eyebrow className="text-blue-100/60 after:bg-blue-100/20">
                {pageContent.eyebrow || "Solution Architecture"}
              </Eyebrow>

              <div className="space-y-5">
                <h1 className={`${pageHeroTitleClass} text-white`}>
                  Website development, software, ERP, digital marketing
                  <br className="hidden lg:block" />
                  <span className="text-glow bg-gradient-to-r from-[#2563eb] to-[#10b981] bg-clip-text text-transparent">
                    and business support services in one place
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-[1.1rem] leading-8 text-blue-100/70">
                  {pageContent.description ||
                    "Browse enterprise-grade product modules and digital solutions engineered to automate operations and accelerate growth."}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <PrimaryLink href="/contact" className="min-h-0 px-8 py-3.5">
                  Request a Quote
                </PrimaryLink>
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
                  className={`whitespace-nowrap font-black uppercase tracking-[0.14em] text-[10px] ${
                    isActive
                      ? "inline-flex min-h-11 items-center justify-center rounded-full border border-white bg-white px-6 py-2.5 text-center text-[#0c0e18] shadow-[0_18px_45px_-24px_rgba(37,99,235,0.35)] transition duration-300"
                      : filterButtonClass(false)
                  }`}
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
                className="group veagle-premium-card flex h-full flex-col overflow-hidden rounded-[1rem] border border-white/6 bg-[color:var(--surface)] backdrop-blur-[12px] transition duration-300"
              >
                {/* Product image */}
                {hasImage ? (
                  <div className="relative h-44 w-full shrink-0 overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,color-mix(in srgb,var(--page-bg) 70%,transparent))]" />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-7 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--accent)]/10 text-[color:var(--accent)] transition duration-300 group-hover:bg-white group-hover:text-black">
                      <Icon className="veagle-icon-animate h-6 w-6" />
                    </div>
                    <span
                      className={`rounded px-2 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <h3 className="font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)] leading-tight">
                    {product.title}
                  </h3>
                  <p className="mt-4 flex-grow line-clamp-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                    {product.description}
                  </p>

                  <div className="mt-7 flex items-center justify-between border-t border-white/5 pt-5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                      {categoryName}
                    </span>
                    <ArrowRight className="veagle-icon-animate h-4.5 w-4.5 text-[color:var(--text-muted)] group-hover:text-white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!filteredProducts.length ? (
          <div className="mt-8 rounded-[1rem] border border-dashed border-[color:var(--border)] bg-[color:var(--surface)] px-6 py-12 text-center">
              <h3 className="font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                No products published yet
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-muted)]">
                Add products from the dashboard to publish your live solution catalog here.
              </p>
            </div>
          ) : null}
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className={`veagle-inverse-surface mx-auto max-w-6xl ${ctaShellClass} border border-white/10 bg-[linear-gradient(135deg,#182a59,#0c0e18)] shadow-[0_30px_90px_-44px_rgba(6,12,28,0.72)]`}>
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
                {ctaTitle}
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-blue-100/70 sm:text-lg">
                {ctaDescription}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <PrimaryLink href="/contact">
                  Request a Quote
                </PrimaryLink>
                <SecondaryLink href="/contact">
                  Discuss a Custom Solution
                </SecondaryLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
