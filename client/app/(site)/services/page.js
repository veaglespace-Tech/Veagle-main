import ServicesPageContent from "@/components/site/ServicesPageContent";
import { getServices } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Website Development, Software, ERP and SEO Services in Pune",
  description:
    `Explore ${COMPANY_NAME} services including website development, e-commerce websites, software development, ERP systems, mobile apps, UI/UX, digital marketing, SEO / SMO, BPO / KPO and resource outsourcing.`,
  path: "/services",
  keywords: [
    "website development services in Pune",
    "software development services in Pune",
    "ERP development services Pune",
    "digital marketing services Pune",
    "SEO services Pune",
    "resource outsourcing services",
  ],
});

export default async function ServicesPage() {
  const [services, content] = await Promise.all([getServices(), getSiteContent()]);
  return <ServicesPageContent services={services} content={content} />;
}

