import HomePage from "@/components/site/HomePage";
import { getClients, getJobs, getProducts, getServices } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import {
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildPageMetadata,
} from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Software Development Company in Pune | Dynamic Website Development",
  description:
    `${COMPANY_NAME} is a Pune-based company for dynamic website development, software development, ERP systems, mobile apps, digital marketing and SEO-ready business solutions.`,
  path: "/",
  keywords: [
    "software development company in Pune",
    "dynamic website development company Pune",
    "website development company Pune",
    "ERP development company Pune",
    "digital marketing services Pune",
    "SEO company Pune",
  ],
});

export default async function Page() {
  const [content, services, products, jobs, clientsData] = await Promise.all([
    getSiteContent(),
    getServices(),
    getProducts(),
    getJobs(),
    getClients(),
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
      <HomePage content={content} services={services} products={products} jobs={jobs} clientsData={clientsData} />
    </>
  );
}

