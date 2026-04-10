"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export const LIGHT_THEME = "veagle-light";
export const DARK_THEME = "veagle-dark";
export const THEME_STORAGE_KEY = "veagle-theme";

export const themeInitScript = `
  (function () {
    try {
      document.documentElement.setAttribute("data-theme", "${DARK_THEME}");
      document.documentElement.style.colorScheme = "dark";
      localStorage.setItem("${THEME_STORAGE_KEY}", "${DARK_THEME}");
    } catch (error) {}
  })();
`;

function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme === DARK_THEME ? "dark" : "light";
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DARK_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    applyTheme(DARK_THEME);
    setTheme(DARK_THEME);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    applyTheme(DARK_THEME);
    localStorage.setItem(THEME_STORAGE_KEY, DARK_THEME);
  }, [mounted]);

  const value = useMemo(
    () => ({
      theme: DARK_THEME,
      isDark: true,
      isLight: false,
      setTheme: () => setTheme(DARK_THEME),
      toggleTheme: () => setTheme(DARK_THEME),
      mounted,
    }),
    [mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
