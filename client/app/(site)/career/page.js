import CareerPageContent from "@/components/site/CareerPageContent";
import { getJobs } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Careers and Hiring Opportunities",
  description:
    `Explore open roles at ${COMPANY_NAME} across software, website development, design, marketing and business support functions.`,
  path: "/career",
  keywords: [
    `${COMPANY_NAME} careers`,
    "software jobs Pune",
    "frontend jobs Pune",
    "spring boot jobs Pune",
    "digital marketing jobs Pune",
  ],
});

export default async function CareerPage() {
  const [jobs, content] = await Promise.all([getJobs(), getSiteContent()]);
  return <CareerPageContent jobs={jobs} content={content} />;
}

