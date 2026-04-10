import { Suspense } from "react";

import PortalLoginPage from "@/components/portal/PortalLoginPage";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = {
  title: "Superadmin Login",
  description: `Restricted superadmin login for ${COMPANY_NAME}.`,
};

export default function SuperadminLoginPage() {
  return (
    <Suspense fallback={null}>
      <PortalLoginPage
        allowedRoles={["SADMIN"]}
        defaultRole="SADMIN"
        title={`${COMPANY_NAME} Superadmin`}
        subtitle="Restricted superadmin access only"
        showRegister={false}
      />
    </Suspense>
  );
}
