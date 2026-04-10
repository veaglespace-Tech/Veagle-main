import { Suspense } from "react";

import PortalLoginPage from "@/components/portal/PortalLoginPage";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = {
  title: "User Login",
  description: `User login for contact submissions and job applications at ${COMPANY_NAME}.`,
};

export default function UserLoginPage() {
  return (
    <Suspense fallback={null}>
      <PortalLoginPage
        allowedRoles={["USER"]}
        defaultRole="USER"
        subtitle="User login for contact requests and job applications"
        showRegister
      />
    </Suspense>
  );
}
