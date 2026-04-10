import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Login Redirect",
  description: "Redirects to the internal admin login page.",
};

export default function AdminLoginAliasPage() {
  redirect("/portal/admin-login");
}
