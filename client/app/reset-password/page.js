import { Suspense } from "react";

import PortalResetPasswordRequestPage from "@/components/portal/PortalResetPasswordRequestPage";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = {
  title: "Reset Password",
  description: `Reset your ${COMPANY_NAME} account password.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <PortalResetPasswordRequestPage />
    </Suspense>
  );
}
