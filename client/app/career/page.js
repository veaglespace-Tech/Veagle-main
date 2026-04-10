import CareerPageContent from "@/components/site/CareerPageContent";
import { getJobs } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Careers and Hiring",
  description:
    `Explore open roles at ${COMPANY_NAME} and apply directly from a cleaner, validated careers experience.`,
  path: "/career",
  keywords: [
    `${COMPANY_NAME} careers`,
    "software jobs Pune",
    "frontend jobs Pune",
    "spring boot jobs Pune",
  ],
});

export default async function CareerPage() {
  const [jobs, content] = await Promise.all([getJobs(), getSiteContent()]);
  return <CareerPageContent jobs={jobs} content={content} />;
}
