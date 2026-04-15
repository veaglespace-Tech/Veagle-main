"use client";

import { useTheme } from "@/components/ThemeProvider";
import {
  COMPANY_FACEBOOK,
  COMPANY_INSTAGRAM,
  COMPANY_LINKEDIN,
  COMPANY_WHATSAPP,
} from "@/lib/site";

export function WhatsAppIcon(props) {
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
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export function FacebookIcon(props) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function InstagramIcon(props) {
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

export function LinkedInIcon(props) {
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

export const socialLinksData = [
  { href: COMPANY_WHATSAPP, label: "WhatsApp", icon: WhatsAppIcon, colorClass: "hover:bg-[#25D366]" },
  { href: COMPANY_FACEBOOK, label: "Facebook", icon: FacebookIcon, colorClass: "hover:bg-[#1877F2]" },
  { href: COMPANY_INSTAGRAM, label: "Instagram", icon: InstagramIcon, colorClass: "hover:bg-[#E4405F]" },
  { href: COMPANY_LINKEDIN, label: "LinkedIn", icon: LinkedInIcon, colorClass: "hover:bg-[#0A66C2]" },
];

export default function StickySocialBar() {
  const { isDark } = useTheme();

  return (
    <div
      className={`fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-2 rounded-l-2xl border-y border-l p-2 shadow-2xl backdrop-blur-xl transition-all max-md:hidden ${
        isDark
          ? "border-[#29427e] bg-[linear-gradient(180deg,rgba(26,42,89,0.98),rgba(12,20,44,0.96))] shadow-[0_30px_70px_-30px_rgba(37,99,235,0.45)]"
          : "border-[color:var(--border)] bg-[color:var(--surface)]"
      }`}
    >
      {socialLinksData.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            aria-label={social.label}
            title={social.label}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 hover:text-white ${
              isDark
                ? "bg-[rgba(10,18,38,0.72)] text-white/78 ring-1 ring-white/8 hover:ring-transparent"
                : "bg-[color:var(--surface-muted)] text-[color:var(--text-secondary)]"
            } ${social.colorClass}`}
          >
            <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            <span
              className={`absolute right-full mr-3 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-bold tracking-widest opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 ${
                isDark
                  ? "border-[#35508f] bg-[#16284f] text-white"
                  : "border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--text-primary)]"
              }`}
            >
              {social.label}
            </span>
          </a>
        );
      })}
    </div>
  );
}
