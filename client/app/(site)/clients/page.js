import ClientsPageContent from "@/components/site/ClientsPageContent";
import { getClients } from "@/lib/backend";
import { getSiteContent } from "@/lib/cms/store";
import { buildPageMetadata } from "@/lib/seo";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Clients, Industries and Partnership Experience",
  description:
    `See the industries, business segments and delivery areas ${COMPANY_NAME} supports through websites, software and digital solutions.`,
  path: "/clients",
  keywords: [
    `${COMPANY_NAME} clients`,
    "technology partners Pune",
    "software company industry expertise",
    "website and software company Pune",
  ],
});

export default async function ClientsPage() {
  const [content, clients] = await Promise.all([getSiteContent(), getClients()]);
  return <ClientsPageContent content={content} clientsData={clients} />;
}

