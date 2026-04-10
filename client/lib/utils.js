export function cn(...values) {
  return values.filter(Boolean).join(" ");
}

export function slugify(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function titleFromSlug(slug = "") {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatDate(value) {
  if (!value) {
    return "Just now";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function generateId(prefix = "item") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeRole(role = "") {
  return role.replace(/^ROLE_/, "").toUpperCase();
}

export function decodeJwtPayload(token) {
  if (!token) {
    return null;
  }

  const parts = token.split(".");

  if (parts.length < 2) {
    return null;
  }

  try {
    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

    if (typeof window === "undefined") {
      return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
    }

    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
}
