import PortfolioPageContent from "@/components/site/PortfolioPageContent";
import { getPortfolio } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Portfolio",
  description:
    `See the real project work, deployments and delivery outcomes from ${COMPANY_NAME}.`,
  path: "/portfolio",
  keywords: [`${COMPANY_NAME} portfolio`, "software company portfolio Pune"],
});

export default async function PortfolioPage() {
  const [content, portfolio] = await Promise.all([getSiteContent(), getPortfolio()]);
  return <PortfolioPageContent content={content} portfolioData={portfolio} />;
}

