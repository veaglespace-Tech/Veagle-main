import ServiceDetailPageContent from "@/components/site/ServiceDetailPageContent";
import { getServiceBySlug, getServices } from "@/lib/backend";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export async function generateMetadata({ params }) {
  const service = await getServiceBySlug(params.slug);
  const title = service?.title ? `${service.title}` : "Service detail";
  const description = service?.description
    ? service.description
    : `Explore service capabilities and delivery workflow from ${COMPANY_NAME}.`;

  return buildPageMetadata({
    title,
    description,
    path: `/services/${params.slug}`,
    keywords: [
      `${COMPANY_NAME} services`,
      "dynamic website service",
      "software development service",
      "ERP service",
      "dashboard service",
    ],
  });
}

export default async function ServiceDetailPage({ params }) {
  const [service, services] = await Promise.all([
    getServiceBySlug(params.slug),
    getServices(),
  ]);

  if (!service) {
    return (
      <main className="px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-headline text-3xl font-black tracking-tight text-white sm:text-4xl">
            Service not found
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
            This service slug does not exist. Please return to the services listing.
          </p>
        </div>
      </main>
    );
  }

  const relatedServices = (services || [])
    .filter((item) => item?.slug && item.slug !== service.slug)
    .slice(0, 3);

  return (
    <ServiceDetailPageContent service={service} relatedServices={relatedServices} />
  );
}

