"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import BrandMark from "@/components/BrandMark";
import { socialLinksData } from "@/components/site/StickySocialBar";
import {
  COMPANY_ADDRESS,
  COMPANY_ADDRESS_QUERY,
  COMPANY_EMAIL,
  COMPANY_EMAIL_LINK,
  COMPANY_LEGAL_NAME,
  COMPANY_NAME,
  COMPANY_PHONE,
  COMPANY_PHONE_LINK,
  COMPANY_TAGLINE,
} from "@/lib/site";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
];

function FooterLink({ href, label, external = false }) {
  const className =
    "group inline-flex items-center break-words text-sm leading-7 text-[color:var(--text-secondary)] transition-colors duration-300 hover:text-[color:var(--text-primary)]";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
      <span className="ml-2 -translate-x-1 text-xs opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        {"->"}
      </span>
    </Link>
  );
}

function buildServiceLinks(services = []) {
  if (!Array.isArray(services) || services.length === 0) {
    return [];
  }

  return services.slice(0, 4).map((service) => ({
    href: service?.slug ? `/services/${service.slug}` : "/services",
    label: service?.title || "Service",
  }));
}

export default function SiteFooter({ content, services }) {
  const serviceLinks = buildServiceLinks(services);
  const contact = content?.contact || {};
  const footerEmail = contact.email || COMPANY_EMAIL;
  const footerEmailLink = footerEmail ? `mailto:${footerEmail}` : COMPANY_EMAIL_LINK;
  const footerPhone = contact.phone || COMPANY_PHONE;
  const footerPhoneLink = contact.phone
    ? `tel:${String(contact.phone).replace(/[^\d+]/g, "")}`
    : COMPANY_PHONE_LINK;
  const footerAddress = contact.address || COMPANY_ADDRESS;
  const footerAddressQuery = footerAddress
    ? `https://maps.google.com/?q=${encodeURIComponent(footerAddress)}`
    : COMPANY_ADDRESS_QUERY;

  return (
    <footer className="w-full border-t border-[color:var(--border)] bg-[color:var(--page-bg)] pb-2 pt-6">
      <div className="mx-auto max-w-7xl px-8 md:px-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[color:var(--text-muted)]">
            <Link href="/about" className="transition-colors hover:text-[color:var(--accent)]">
              About US
            </Link>
            <span className="opacity-30">|</span>
            <Link href="/contact" className="transition-colors hover:text-[color:var(--accent)]">
              Contact US
            </Link>
            <span className="opacity-30">|</span>
            <Link href="/contact" className="transition-colors hover:text-[color:var(--accent)]">
              Privacy & Policy
            </Link>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-medium tracking-wide text-[color:var(--text-muted)] opacity-80">
              All Right Reserved © {new Date().getFullYear()} {COMPANY_LEGAL_NAME}
            </div>
            <div className="text-[10px] font-medium tracking-wide text-[color:var(--text-muted)] opacity-60">
              Designed & Developed By {COMPANY_LEGAL_NAME}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
