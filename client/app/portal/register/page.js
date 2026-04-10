import { redirect } from "next/navigation";

export const metadata = {
  title: "Registration Redirect",
  description: "User registration redirect.",
};

export default function PortalRegister() {
  redirect("/register");
}
