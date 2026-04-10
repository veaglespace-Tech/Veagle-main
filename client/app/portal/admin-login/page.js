import { Suspense } from "react";

import PortalLoginPage from "@/components/portal/PortalLoginPage";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = {
  title: "Admin Login",
  description: `Internal admin login for ${COMPANY_NAME}.`,
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <PortalLoginPage
        allowedRoles={["ADMIN"]}
        defaultRole="ADMIN"
        title={`${COMPANY_NAME} Admin`}
        subtitle="Internal admin access only"
        showRegister={false}
      />
    </Suspense>
  );
}
