"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import BrandMark from "@/components/BrandMark";
import {
  clearStoredSession,
  isStaffSession,
  PORTAL_SESSION_EVENT,
  readStoredSession,
} from "@/lib/auth-session";
import {
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/site/UiBits";
import { cn } from "@/lib/utils";

const headerLinksBeforeAbout = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
];

const productDropdownLinks = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/clients", label: "Clients" },
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

  const isProductsActive = productDropdownLinks.some((item) => isActive(item.href));

  function handleLogout() {
    clearStoredSession();
    setIsOpen(false);
  }

  const activeEffect = "border-b-2 border-white/30 pb-1 text-white shadow-[0_4px_12px_-4px_rgba(255,255,255,0.2)]";
  const inactiveEffect = "text-[color:var(--text-secondary)] hover:text-white";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--border)] bg-[rgba(10,13,18,0.85)] shadow-2xl backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 lg:px-8">
        <BrandMark tone="light" />

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
                isProductsActive ? activeEffect : inactiveEffect
              )}
            >
              Products
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>

            <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="rounded-2xl border border-white/10 bg-slate-950/98 p-2 shadow-2xl backdrop-blur-2xl">
                {productDropdownLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 font-headline text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-white/10 text-white"
                        : "text-[color:var(--text-muted)] hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
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
          {session ? (
            <div className="flex items-center gap-4">
              {isStaffSession(session) && (
                <Link
                  href="/portal"
                  className="font-headline text-xs font-bold uppercase tracking-widest text-[color:var(--text-secondary)] transition-colors hover:text-white"
                >
                  Portal
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="font-headline text-xs font-bold uppercase tracking-widest text-[color:var(--text-secondary)] transition-colors hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="font-headline text-xs font-bold uppercase tracking-widest text-[color:var(--text-secondary)] transition-colors hover:text-white"
            >
              Login
            </Link>
          )}
          <Link
            href="/contact"
            className={cn(primaryButtonClass, "min-h-0 px-6 py-2.5 text-xs uppercase tracking-widest")}
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-950/98 px-4 py-6 backdrop-blur-2xl md:hidden">
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
                      ? "bg-white/10 text-white"
                      : "text-[color:var(--text-secondary)] hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="px-1 pb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[color:var(--text-muted)] opacity-60">
                Products & More
              </p>
              <div className="grid gap-1">
                {productDropdownLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block rounded-xl px-4 py-3 font-headline text-sm font-bold transition-all",
                      isActive(item.href)
                        ? "text-[color:var(--accent)]"
                        : "text-[color:var(--text-secondary)] hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-3 pt-2">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className={cn(primaryButtonClass, "w-full rounded-xl py-4 text-xs uppercase tracking-widest")}
              >
                Get Started
              </Link>
              {!session && (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className={cn(secondaryButtonClass, "w-full rounded-xl py-4 text-xs uppercase tracking-widest")}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
