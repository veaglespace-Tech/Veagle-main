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
  pageClass,
  sectionClass,
} from "@/components/site/UiBits";
import { getProducts } from "@/lib/backend";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";
import { slugify } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => slugify(p.title) === slug);
  const title = product?.title ? `${product.title}` : "Product detail";
  const description = product?.description
    ? product.description
    : `Explore product capabilities and solutions from ${COMPANY_NAME}.`;

  return buildPageMetadata({
    title,
    description,
    path: `/products/${slug}`,
    keywords: [
      `${COMPANY_NAME} products`,
      "business software products",
      "digital products showcase",
    ],
  });
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p) => slugify(p.title) === slug);

  if (!product) {
    return (
      <main className="px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-headline text-3xl font-black tracking-tight text-white sm:text-4xl">
            Product not found
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
            This product does not exist. Please return to the products listing.
          </p>
          <div className="mt-8">
            <PrimaryLink href="/products">Back to Products</PrimaryLink>
          </div>
        </div>
      </main>
    );
  }

  const relatedProducts = products
    .filter((p) => slugify(p.title) !== slug)
    .slice(0, 3);

  const categoryName = product.categoryName || "General";

  return (
    <main className={pageClass}>
      <section className={`${firstSectionClass} relative overflow-hidden pb-16 sm:pb-20`}>
        <div className="veagle-section-wash" />
        <div className="veagle-grid-background" />

        <div className={`${containerClass} relative z-10 grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-center`}>
          {product.imageUrl ? (
            <div className="overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,#171b24,#1d222d)] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.3)]">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#101622]">
                <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden sm:min-h-[440px]">
                  <Image
                    alt={product.title}
                    className="object-cover"
                    fill
                    sizes="(max-width: 1280px) 100vw, 52vw"
                    src={product.imageUrl}
                    unoptimized
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-6">
            <Eyebrow>Product detail</Eyebrow>

            <div className="space-y-4">
              <h1 className="font-headline text-4xl font-black tracking-tighter text-[color:var(--text-primary)] sm:text-5xl lg:text-6xl">
                {product.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
                {product.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                  Category
                </p>
                <p className="mt-3 font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
                  {categoryName}
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                  Content source
                </p>
                <p className="mt-3 font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
                  Dashboard
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[rgba(255,255,255,0.04)] p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                  Next step
                </p>
                <p className="mt-3 font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
                  Quote
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip className="border-white/10 bg-white/[0.05] text-[#dce6fb]">
                {categoryName}
              </Chip>
              <Chip className="border-white/10 bg-white/[0.05] text-[#dce6fb]">
                Dashboard-managed
              </Chip>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <PrimaryLink href="/contact">Get a Quote</PrimaryLink>
              <SecondaryLink href="/products">Back to Products</SecondaryLink>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-28">
        <div className={`${containerClass} grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-start`}>
          <div className="space-y-6">
            <SectionIntro
              eyebrow="Related products"
              title="Explore more solutions from our catalog"
              description="Continue browsing related products and digital solutions."
            />

            {relatedProducts.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {relatedProducts.map((item) => {
                  const itemSlug = slugify(item.title);
                  return (
                    <Link
                      key={itemSlug}
                      href={`/products/${itemSlug}`}
                      className="group overflow-hidden rounded-[1.7rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,#171b24,#1d222d)] shadow-[0_24px_70px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1"
                    >
                      {item.imageUrl ? (
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            alt={item.title}
                            className="object-cover transition duration-500 group-hover:scale-105"
                            fill
                            sizes="(max-width: 1280px) 100vw, 33vw"
                            src={item.imageUrl}
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,18,26,0.8))]" />
                        </div>
                      ) : null}
                      <div className="space-y-3 px-5 pb-5 pt-4">
                        <h3 className="font-headline text-2xl font-black tracking-tight text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-7 text-[color:var(--text-secondary)]">
                          {item.description}
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--accent)] transition group-hover:gap-3">
                          View product
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No related products yet"
                description="As more products are added, related items will appear here automatically."
              />
            )}
          </div>

          <div className="space-y-6">
            <SectionIntro
              eyebrow="Get started"
              title="Interested in this product? Let us know"
              description="Use this form to start the discussion."
            />
            <LeadCaptureForm defaultService={product.title} />
          </div>
        </div>
      </section>
    </main>
  );
}
