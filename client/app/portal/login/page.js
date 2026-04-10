import { redirect } from "next/navigation";

export const metadata = {
  title: "Portal Login Redirect",
  description: "Internal portal login redirect.",
};

export default function PortalLogin() {
  redirect("/portal/admin-login");
}
