import AboutPageContent from "@/components/site/AboutPageContent";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "About Us",
  description:
    `Learn how ${COMPANY_NAME} approaches software, dynamic websites, admin dashboards and growth-ready digital experiences.`,
  path: "/about",
  keywords: [
    `about ${COMPANY_NAME}`,
    "software company Pune",
    "website company Pune",
    "admin dashboard solutions",
  ],
});

export default async function AboutPage() {
  const content = await getSiteContent();
  return <AboutPageContent content={content} />;
}

