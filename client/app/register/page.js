import { Suspense } from "react";

import PortalRegisterPage from "@/components/portal/PortalRegisterPage";
import { COMPANY_NAME } from "@/lib/site";

export const metadata = {
  title: "User Registration",
  description: `Register a user account at ${COMPANY_NAME} to contact the team and apply for jobs.`,
};

export default function UserRegisterPage() {
  return (
    <Suspense fallback={null}>
      <PortalRegisterPage />
    </Suspense>
  );
}
