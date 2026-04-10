import ContactPageContent from "@/components/site/ContactPageContent";
import { getServices } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Contact Us",
  description:
    `Contact ${COMPANY_NAME} for dynamic websites, software, ERP systems, dashboard UX, SEO and business support requirements.`,
  path: "/contact",
  keywords: [
    `contact ${COMPANY_NAME}`,
    "software company contact Pune",
    "website development contact Pune",
    "dashboard development contact",
  ],
});

export default async function ContactPage() {
  const [content, services] = await Promise.all([
    getSiteContent(),
    getServices(),
  ]);

  return <ContactPageContent content={content} services={services} />;
}
