import { redirect } from "next/navigation";

export const metadata = {
  title: "User Redirect",
  description: "Public users are redirected to the website.",
};

export default function PortalUserRoute() {
  redirect("/");
}
