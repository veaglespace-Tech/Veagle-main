import ContactPageContent from "@/components/site/ContactPageContent";
import { getServices } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Contact Veagle Space | Website, Software and SEO Company in Pune",
  description:
    `Contact ${COMPANY_NAME} for website development, software solutions, ERP systems, e-commerce, digital marketing, SEO and business support requirements.`,
  path: "/contact",
  keywords: [
    `contact ${COMPANY_NAME}`,
    "software company contact Pune",
    "website development contact Pune",
    "SEO company contact Pune",
    "ERP software contact Pune",
  ],
});

export default async function ContactPage() {
  const [content, services] = await Promise.all([getSiteContent(), getServices()]);

  return <ContactPageContent content={content} services={services} />;
}

