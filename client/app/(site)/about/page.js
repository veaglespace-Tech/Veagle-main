import AboutPageContent from "@/components/site/AboutPageContent";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "About Veagle Space | Software and Website Company in Pune",
  description:
    `Learn about ${COMPANY_NAME}, a Pune-based company offering software development, website development, ERP solutions, UI/UX and digital growth support.`,
  path: "/about",
  keywords: [
    `about ${COMPANY_NAME}`,
    "software company in Pune",
    "website development company in Pune",
    "digital solutions company Pune",
    "ERP and software company Pune",
  ],
});

export default async function AboutPage() {
  const content = await getSiteContent();
  return <AboutPageContent content={content} />;
}

