import { redirect } from "next/navigation";

export const metadata = {
  title: "Superadmin Login Redirect",
  description: "Redirects to the internal superadmin login page.",
};

export default function SuperAdminLoginAliasPage() {
  redirect("/portal/superadmin-login");
}
