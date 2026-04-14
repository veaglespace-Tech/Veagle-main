import PortfolioPageContent from "@/components/site/PortfolioPageContent";
import { getPortfolio } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Portfolio | Website, Software and Digital Project Work",
  description:
    `See the kind of website, software, dashboard and digital delivery work ${COMPANY_NAME} is positioned to build for modern businesses.`,
  path: "/portfolio",
  keywords: [
    `${COMPANY_NAME} portfolio`,
    "software company portfolio Pune",
    "website development portfolio Pune",
  ],
});

export default async function PortfolioPage() {
  const [content, portfolio] = await Promise.all([getSiteContent(), getPortfolio()]);
  return <PortfolioPageContent content={content} portfolioData={portfolio} />;
}

