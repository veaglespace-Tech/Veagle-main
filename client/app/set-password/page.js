import { Suspense } from "react";

import PortalSetPasswordPage from "@/components/portal/PortalSetPasswordPage";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = {
  title: "Set Password",
  description: `Set your ${COMPANY_NAME} account password.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <PortalSetPasswordPage />
    </Suspense>
  );
}
