import PortfolioPageContent from "@/components/site/PortfolioPageContent";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Portfolio and Selected Work",
  description:
    `Browse ${COMPANY_NAME} portfolio-style case studies across websites, software experiences and operational workflows.`,
  path: "/portfolio",
  keywords: [
    `${COMPANY_NAME} portfolio`,
    "website project portfolio Pune",
    "software case studies Pune",
    "UI UX project showcase",
  ],
});

export default async function PortfolioPage() {
  const content = await getSiteContent();
  return <PortfolioPageContent content={content} />;
}
