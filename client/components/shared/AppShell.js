"use client";

import { usePathname } from "next/navigation";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/portal");

  if (isPortal) {
    return children;
  }

  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
