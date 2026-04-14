import ProductsPageContent from "@/components/site/ProductsPageContent";
import { getCategories, getProducts } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Business Solutions, Digital Products and Software Modules",
  description:
    `Explore ${COMPANY_NAME} products, business solutions, digital offerings and category-based software modules built for modern business needs.`,
  path: "/products",
  keywords: [
    `${COMPANY_NAME} products`,
    "business software products Pune",
    "digital products showcase",
    "business solutions company Pune",
    "software modules and digital products",
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

