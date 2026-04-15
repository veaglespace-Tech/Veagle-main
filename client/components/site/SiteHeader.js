"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  ChevronDown,
  FolderKanban,
  Layers3,
  Menu,
  Sparkles,
  Users2,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";

import BrandMark from "@/components/BrandMark";
import {
  clearStoredSession,
  isStaffSession,
  PORTAL_SESSION_EVENT,
  readStoredSession,
} from "@/lib/auth-session";
import { primaryButtonClass } from "@/components/site/UiBits";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/site/ThemeToggle";

const headerLinksBeforeAbout = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
];

const exploreLinks = [
  {
    key: "products",
    href: "/products",
    label: "Products",
    description: "Browse business-ready digital products and packaged modules.",
    badge: "Packaged solutions",
    points: ["Ready solution categories", "Product snapshots", "Faster launch direction"],
    icon: Layers3,
  },
  {
    key: "services",
    href: "/services",
    label: "Services",
    description: "See the delivery streams for websites, platforms and growth support.",
    badge: "Execution services",
    points: ["Clear service breakdowns", "Build and support scope", "Faster decision-making"],
    icon: Sparkles,
  },
  {
    key: "portfolio",
    href: "/portfolio",
    label: "Portfolio",
    description: "Review selected work, outcomes and implementation direction.",
    badge: "Delivery proof",
    points: ["Case-style presentation", "Visual delivery examples", "Outcome-focused storytelling"],
    icon: FolderKanban,
  },
  {
    key: "clients",
    href: "/clients",
    label: "Clients",
    description: "Understand the industries and organizations we support.",
    badge: "Industry fit",
    points: ["Trust signals", "Industry context", "Business-facing communication"],
    icon: Users2,
  },
];

const headerLinksAfterAbout = [
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
];

function subscribeToSession(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(PORTAL_SESSION_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PORTAL_SESSION_EVENT, callback);
  };
}

function getSessionSnapshot() {
  if (typeof window === "undefined") {
    return "";
  }

  const session = readStoredSession();
  return session ? JSON.stringify(session) : "";
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeExploreKey, setActiveExploreKey] = useState(exploreLinks[0].key);
  const sessionSnapshot = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    () => ""
  );
  const session = useMemo(() => {
    if (!sessionSnapshot) {
      return null;
    }

    try {
      const parsed = JSON.parse(sessionSnapshot);
      return parsed?.token ? parsed : null;
    } catch {
      return null;
    }
  }, [sessionSnapshot]);

  function isActive(href) {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  }

  const isExploreActive = exploreLinks.some((item) => isActive(item.href));
  const activeExploreItem =
    exploreLinks.find((item) => item.key === activeExploreKey) || exploreLinks[0];
  const ActiveExploreIcon = activeExploreItem.icon;

  function handleLogout() {
    clearStoredSession();
    setIsOpen(false);
  }

  const activeEffect = "border-b-2 border-[color:var(--accent)] pb-1 text-[color:var(--text-primary)] font-bold";
  const inactiveEffect = "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--page-bg)]/85 shadow-2xl backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 lg:px-8">
        <BrandMark tone="auto" />

        <nav className="hidden items-center gap-7 md:flex">
          {headerLinksBeforeAbout.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-headline text-sm font-semibold tracking-tight transition-all duration-300",
                isActive(item.href) ? activeEffect : inactiveEffect
              )}
            >
              {item.label}
            </Link>
          ))}

          <div className="group relative">
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 font-headline text-sm font-semibold tracking-tight transition-all duration-300",
                isExploreActive ? activeEffect : inactiveEffect
              )}
              aria-haspopup="true"
            >
              Explore
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-[44rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="grid gap-3 rounded-[1.9rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-3 shadow-2xl backdrop-blur-2xl md:grid-cols-[0.92fr_1.08fr]">
                <div className="space-y-1 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-2">
                  <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--text-muted)]">
                    Explore the site
                  </p>
                  {exploreLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => setActiveExploreKey(item.key)}
                      onFocus={() => setActiveExploreKey(item.key)}
                      className={cn(
                        "group/item block rounded-[1.2rem] border px-4 py-3 transition-all duration-300",
                        activeExploreItem.key === item.key || isActive(item.href)
                          ? "border-[color:var(--accent)]/30 bg-[color:var(--surface-strong)]"
                          : "border-transparent hover:border-[color:var(--border)] hover:bg-[color:var(--surface-strong)]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-headline text-sm font-semibold text-[color:var(--text-primary)]">
                            {item.label}
                          </p>
                          <p className="mt-1 text-xs leading-6 text-[color:var(--text-secondary)]">
                            {item.description}
                          </p>
                        </div>
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)] transition-transform duration-300 group-hover/item:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="rounded-[1.55rem] border border-[color:var(--border)] bg-[linear-gradient(145deg,rgba(25,94,226,0.10),rgba(10,14,24,0.02))] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--surface-strong)] text-[color:var(--accent)] shadow-[color:var(--shadow-soft)]">
                      <ActiveExploreIcon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--accent)]">
                      {activeExploreItem.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                    {activeExploreItem.label}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-[color:var(--text-secondary)]">
                    {activeExploreItem.description}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {activeExploreItem.points.map((point) => (
                      <div
                        key={point}
                        className="rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-3 text-xs leading-5 text-[color:var(--text-secondary)]"
                      >
                        {point}
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link
                      href={activeExploreItem.href}
                      className={cn(
                        primaryButtonClass,
                        "h-9 min-h-0 whitespace-nowrap px-4 py-2 text-[11px] uppercase tracking-[0.16em] shadow-[0_18px_40px_-24px_rgba(37,99,235,0.68)]"
                      )}
                    >
                      Open {activeExploreItem.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--text-secondary)] transition hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--text-primary)]"
                    >
                      Talk with us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {headerLinksAfterAbout.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-headline text-sm font-semibold tracking-tight transition-all duration-300",
                isActive(item.href) ? activeEffect : inactiveEffect
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {session && (
            <div className="flex items-center gap-4">
              {isStaffSession(session) && (
                <Link
                  href="/portal"
                  className="font-headline text-xs font-bold uppercase tracking-widest text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
                >
                  Portal
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="font-headline text-xs font-bold uppercase tracking-widest text-[color:var(--text-secondary)] transition-colors hover:text-[color:var(--text-primary)]"
              >
                Logout
              </button>
            </div>
          )}
          <ThemeToggle />
          <Link
            href="/contact"
            className={cn(primaryButtonClass, "min-h-0 px-6 py-2.5 text-xs uppercase tracking-widest")}
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[color:var(--border)] bg-[color:var(--page-bg)]/95 px-4 py-6 backdrop-blur-2xl md:hidden">
          <div className="mx-auto max-w-screen-2xl space-y-4">
            <div className="grid gap-2">
              {[...headerLinksBeforeAbout, ...headerLinksAfterAbout].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3.5 font-headline text-sm font-bold transition-all",
                    isActive(item.href)
                      ? "bg-[color:var(--surface-strong)] text-[color:var(--text-primary)]"
                      : "text-[color:var(--text-secondary)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text-primary)]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
              <p className="px-1 pb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[color:var(--text-muted)] opacity-60">
                Explore
              </p>
              <div className="grid gap-1">
                {exploreLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    onFocus={() => setActiveExploreKey(item.key)}
                    className={cn(
                      "block rounded-xl px-4 py-3 font-headline text-sm font-bold transition-all",
                      isActive(item.href)
                        ? "bg-[color:var(--surface-strong)] text-[color:var(--accent)]"
                        : "text-[color:var(--text-secondary)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--text-primary)]"
                    )}
                  >
                    <span className="block">{item.label}</span>
                    <span className="mt-1 block text-xs font-medium normal-case tracking-normal text-[color:var(--text-muted)]">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[color:var(--text-muted)] opacity-60">
                  Switch Theme
                </span>
                <ThemeToggle />
              </div>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className={cn(primaryButtonClass, "w-full rounded-xl py-4 text-xs uppercase tracking-widest")}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
