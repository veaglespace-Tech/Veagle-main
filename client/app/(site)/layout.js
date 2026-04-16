import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { getServices } from "@/lib/backend";
import StickySocialBar from "@/components/site/StickySocialBar";
import VeagleWidget from "@/components/VeagleWidget";
import { getSiteContent } from "@/lib/cms/store";

export default async function SiteLayout({ children }) {
  const [content, services] = await Promise.all([
    getSiteContent(),
    getServices(),
  ]);

  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <StickySocialBar />
      {children}
      <VeagleWidget />
      <SiteFooter content={content} services={services} />
    </div>
  );
}
