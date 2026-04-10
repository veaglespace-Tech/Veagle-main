import { notFound } from "next/navigation";

import ServiceDetailPageContent from "@/components/site/ServiceDetailPageContent";
import { getServiceBySlug, getServices } from "@/lib/backend";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return buildPageMetadata({
      title: "Service Not Found",
      description: "The requested service page could not be found.",
      path: `/services/${slug}`,
    });
  }

  return buildPageMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${slug}`,
    keywords: [service.title, `${service.title} Pune`, `${COMPANY_NAME} service`],
  });
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const [service, services] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
  ]);

  if (!service) {
    notFound();
  }

  const relatedServices = services
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  return (
    <ServiceDetailPageContent
      service={service}
      relatedServices={relatedServices}
    />
  );
}
