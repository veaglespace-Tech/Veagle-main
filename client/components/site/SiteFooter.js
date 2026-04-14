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
    "group inline-flex items-center break-words text-sm leading-7 text-slate-400 transition-colors duration-300 hover:text-slate-100";

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
    <footer className="w-full border-t border-slate-800/30 bg-[#0b0e14] pb-12 pt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-8 pb-24 md:grid-cols-4 md:px-12">
        <div className="space-y-8">
          <div className="font-headline text-2xl font-bold tracking-tighter text-slate-50">
            <BrandMark variant="footer" tone="light" />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">{COMPANY_TAGLINE}</p>
          <div className="flex space-x-4">
            {socialLinksData.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-container-high)] text-[color:var(--accent)] transition-all hover:bg-[color:var(--accent)] hover:text-[color:var(--button-ink)]"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="font-headline text-sm font-black uppercase tracking-[0.2em] text-[color:var(--accent)]">
            Services
          </h3>
          <ul className="space-y-4">
            <li>
              <FooterLink href="/services" label="Explore services" />
            </li>
            <li className="pt-4 text-[10px] font-black uppercase tracking-[0.24em] text-[color:var(--text-muted)] opacity-60">
              Capabilities
            </li>
            {(serviceLinks.length ? serviceLinks : [{ href: "/services", label: "Dynamic Websites" }])
              .slice(0, 3)
              .map((link) => (
                <li key={link.label} className="text-sm font-medium text-[color:var(--text-muted)]">
                  {link.label}
                </li>
              ))}
          </ul>
        </div>

        <div className="space-y-8">
          <h3 className="font-headline text-sm font-black uppercase tracking-[0.2em] text-[color:var(--text-primary)]">
            Quick Links
          </h3>
          <nav className="flex flex-col space-y-4">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[color:var(--text-secondary)] transition-colors duration-300 hover:text-[color:var(--text-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-8">
          <h3 className="font-headline text-sm font-black uppercase tracking-[0.2em] text-[color:var(--text-primary)]">
            Contact
          </h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                <Mail className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)] opacity-60">
                  Email
                </p>
                <a
                  href={footerEmailLink}
                  className="text-sm font-medium text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
                >
                  {footerEmail}
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                <Phone className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)] opacity-60">
                  Phone
                </p>
                <a
                  href={footerPhoneLink}
                  className="text-sm font-medium text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
                >
                  {footerPhone}
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[color:var(--text-muted)] opacity-60">
                  Address
                </p>
                <a
                  href={footerAddressQuery}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium leading-relaxed text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
                >
                  {footerAddress}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-[color:var(--border)] px-8 pt-12 md:px-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--text-muted)] opacity-50">
            Copyright {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
            <Link href="/contact" className="transition-colors hover:text-[color:var(--text-primary)]">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition-colors hover:text-[color:var(--text-primary)]">
              Privacy Policy
            </Link>
            <Link href="/login" className="transition-colors hover:text-[color:var(--text-primary)]">
              Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
