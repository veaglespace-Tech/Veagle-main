"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { toggleTheme, isDark, mounted } = useTheme();

  if (!mounted) {
    return <div className="h-10 w-10 shrink-0" />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-primary)] transition-all duration-300 hover:scale-110 hover:border-[color:var(--border-strong)] hover:bg-[color:var(--surface-strong)]"
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          } text-[color:var(--accent)]`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          } text-[color:var(--text-primary)]`}
        />
      </div>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-md bg-[color:var(--accent)]/10" />
    </button>
  );
}
