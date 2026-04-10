import ClientsPageContent from "@/components/site/ClientsPageContent";
import { getClients } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Client Segments and Partnership Fit",
  description:
    `See the types of industries and business segments ${COMPANY_NAME} is positioned to support.`,
  path: "/clients",
  keywords: [
    `${COMPANY_NAME} clients`,
    "technology partners Pune",
    "software company industry expertise",
  ],
});

export default async function ClientsPage() {
  const [content, clients] = await Promise.all([
    getSiteContent(),
    getClients(),
  ]);
  return <ClientsPageContent content={content} clientsData={clients} />;
}
