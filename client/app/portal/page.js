import PortalApp from "@/components/portal/PortalApp";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = {
  title: "Portal Dashboard",
  description: `Admin and superadmin dashboard for ${COMPANY_NAME}.`,
};

export default function PortalPage() {
  return <PortalApp />;
}
