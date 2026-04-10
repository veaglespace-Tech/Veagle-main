import HomePage from "@/components/site/HomePage";
import { getJobs, getProducts, getServices } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import {
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildPageMetadata,
} from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Dynamic Software, Web, Dashboard and SEO Experiences",
  description:
    `${COMPANY_NAME} helps businesses with dynamic websites, software development, ERP systems, admin dashboards, digital marketing, SEO / SMO and operational support.`,
  path: "/",
  keywords: [
    "software development Pune",
    "dynamic website development company Pune",
    "admin dashboard development",
    "ERP development company Pune",
    "digital marketing services Pune",
  ],
});

export default async function Page() {
  const [content, services, products, jobs] = await Promise.all([
    getSiteContent(),
    getServices(),
    getProducts(),
    getJobs(),
  ]);
  const organizationSchema = buildOrganizationSchema();
  const localBusinessSchema = buildLocalBusinessSchema();
  const faqSchema = buildFaqSchema(content.faq || []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePage
        content={content}
        services={services}
        products={products}
        jobs={jobs}
      />
    </>
  );
}
