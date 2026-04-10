import ProductsPageContent from "@/components/site/ProductsPageContent";
import { getCategories, getProducts } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Products and Business Solutions",
  description:
    `Explore ${COMPANY_NAME} products, grouped business solutions and category-driven digital offerings.`,
  path: "/products",
  keywords: [
    `${COMPANY_NAME} products`,
    "business software products Pune",
    "digital products showcase",
    "software solutions company Pune",
  ],
});

export default async function ProductsPage() {
  const [products, categories, content] = await Promise.all([
    getProducts(),
    getCategories(),
    getSiteContent(),
  ]);

  return <ProductsPageContent products={products} categories={categories} content={content} />;
}
