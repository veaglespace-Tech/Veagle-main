"use client";

import Link from "next/link";
import { Globe2, Mail, MapPin } from "lucide-react";

import BrandMark from "@/components/BrandMark";
import {
  COMPANY_ADDRESS,
  COMPANY_ADDRESS_QUERY,
  COMPANY_EMAIL,
  COMPANY_EMAIL_LINK,
  COMPANY_INSTAGRAM,
  COMPANY_LINKEDIN,
  COMPANY_LOCATION_LABEL,
  COMPANY_NAME,
} from "@/lib/site";

const serviceLinks = [
  { href: "/services", label: "Dynamic Websites" },
  { href: "/services", label: "Software Development" },
  { href: "/services", label: "ERP Systems" },
  { href: "/services", label: "Admin Dashboards" },
];

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
];

const contactLinks = [
  { href: COMPANY_EMAIL_LINK, label: COMPANY_EMAIL, external: true },
  { href: COMPANY_ADDRESS_QUERY, label: COMPANY_LOCATION_LABEL, external: true },
  { href: "/university/java-full-stack", label: "Veagle University" },
];

const socialLinks = [
  { href: COMPANY_LINKEDIN, label: "LinkedIn", icon: LinkedInIcon },
  { href: COMPANY_INSTAGRAM, label: "Instagram", icon: InstagramIcon },
  { href: "https://www.veaglespace.com", label: "Website", icon: Globe2 },
];

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="17.25" cy="6.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <circle cx="8" cy="8.1" r="0.9" fill="currentColor" stroke="none" />
      <path d="M8 10.6v5.4" />
      <path d="M12 16v-3.1c0-1.45.92-2.32 2.16-2.32 1.24 0 1.84.82 1.84 2.4V16" />
      <path d="M12 10.6v1.15" />
    </svg>
  );
}

function FooterLink({ href, label, external = false }) {
  const className =
    "block break-words text-sm leading-7 text-[color:var(--text-secondary)] transition-colors hover:text-white";

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
    </Link>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-white">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#080b11] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(25,94,226,0.2),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(86,226,64,0.08),transparent_22%),linear-gradient(180deg,rgba(10,14,20,0.96),rgba(7,10,15,1))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <div className="relative w-full border-y border-white/8 bg-[linear-gradient(180deg,rgba(14,18,26,0.96),rgba(10,13,19,0.98))] px-4 py-12 shadow-[0_30px_90px_rgba(0,0,0,0.34)] sm:px-6 sm:py-14 lg:px-12 xl:px-16">
          <div className="grid gap-10 lg:grid-cols-2 xl:grid-cols-[1.45fr_0.78fr_0.78fr_1fr] xl:gap-12">
            <div className="min-w-0 space-y-5">
              <BrandMark variant="footer" tone="light" />
              <p className="max-w-[36rem] text-sm leading-8 text-[color:var(--text-secondary)]">
                {COMPANY_NAME} builds dynamic websites, software systems, ERP
                workflows, dashboards, and digital experiences for businesses
                that want stronger presentation and cleaner operations.
              </p>

              <div className="grid max-w-[42rem] gap-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)]">
                <div className="min-w-0 rounded-[1.25rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#195ee2]/18 text-[#dbe5ff]">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/62">
                        Email
                      </p>
                      <a
                        href={COMPANY_EMAIL_LINK}
                        className="mt-1 block break-all text-[0.96rem] font-medium leading-6 text-white"
                      >
                        {COMPANY_EMAIL}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 rounded-[1.25rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#195ee2]/18 text-[#dbe5ff]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/62">
                        Location
                      </p>
                      <p className="mt-1 text-[0.96rem] font-medium leading-6 text-white">{COMPANY_LOCATION_LABEL}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0">
            <FooterColumn title="Services">
              {serviceLinks.map((link) => (
                <FooterLink key={link.label} href={link.href} label={link.label} />
              ))}
            </FooterColumn>
            </div>

            <div className="min-w-0">
            <FooterColumn title="Quick Links">
              {quickLinks.map((link) => (
                <FooterLink key={link.label} href={link.href} label={link.label} />
              ))}
            </FooterColumn>
            </div>

            <div className="min-w-0 space-y-4">
              <FooterColumn title="Contact">
                {contactLinks.map((link) => (
                  <FooterLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                    external={link.external}
                  />
                ))}
              </FooterColumn>

              <p className="max-w-sm text-sm leading-8 text-[color:var(--text-secondary)]">
                {COMPANY_ADDRESS}
              </p>

              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white transition-colors hover:border-[#195ee2] hover:bg-[#195ee2] hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-[color:var(--text-muted)] md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl">Copyright {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 sm:gap-5">
              <Link href="/contact" className="transition-colors hover:text-white">
                Terms of Service
              </Link>
              <Link href="/contact" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/login" className="transition-colors hover:text-white">
                User Login
              </Link>
            </div>
          </div>
      </div>
    </footer>
  );
}
