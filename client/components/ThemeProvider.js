"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

export const LIGHT_THEME = "veagle-light";
export const DARK_THEME = "veagle-dark";
export const THEME_STORAGE_KEY = "veagle-theme";

export const themeInitScript = `
  (function () {
    try {
      const storedTheme = localStorage.getItem("${THEME_STORAGE_KEY}");
      const theme = storedTheme || "${DARK_THEME}";
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = theme === "${DARK_THEME}" ? "dark" : "light";
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
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === LIGHT_THEME) {
      setTheme(LIGHT_THEME);
      applyTheme(LIGHT_THEME);
    } else {
      applyTheme(DARK_THEME);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === DARK_THEME,
      isLight: theme === LIGHT_THEME,
      setTheme: (t) => {
        setTheme(t);
        applyTheme(t);
        localStorage.setItem(THEME_STORAGE_KEY, t);
      },
      toggleTheme,
      mounted,
    }),
    [theme, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
