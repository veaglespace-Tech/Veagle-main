import { isJwtExpired } from "@/lib/utils";

export const PORTAL_STORAGE_KEY = "veagle-portal-session";
export const PORTAL_SESSION_EVENT = "veagle-portal-session-change";

function dispatchSessionChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(PORTAL_SESSION_EVENT));
}

export function normalizeSessionPayload(payload, persistSession = true) {
  return {
    id: payload?.id ?? "",
    username: payload?.username || "",
    email: payload?.email || "",
    contact: payload?.contact || "",
    role: payload?.normalizedRole || payload?.role || "",
    token: payload?.token || "",
    persistSession,
  };
}

export function readStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(PORTAL_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const session = JSON.parse(raw);
    if (!session?.token || isJwtExpired(session.token)) {
      window.localStorage.removeItem(PORTAL_STORAGE_KEY);
      return null;
    }

    return session;
  } catch {
    window.localStorage.removeItem(PORTAL_STORAGE_KEY);
    return null;
  }
}

export function writeStoredSession(session) {
  if (typeof window === "undefined") {
    return session;
  }

  window.localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(session));
  dispatchSessionChange();
  return session;
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PORTAL_STORAGE_KEY);
  dispatchSessionChange();
}

export function isRoleSession(session, allowedRoles = []) {
  return Boolean(
    session?.token &&
      session?.role &&
      allowedRoles.includes(String(session.role).toUpperCase())
  );
}

export function isUserSession(session) {
  return isRoleSession(session, ["USER"]);
}

export function isStaffSession(session) {
  return isRoleSession(session, ["ADMIN", "SADMIN"]);
}

export function getSafeNextPath(value) {
  if (!value || typeof value !== "string") {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export function buildLoginHref(nextPath = "/") {
  return `/login?next=${encodeURIComponent(getSafeNextPath(nextPath))}`;
}

export function buildRegisterHref(nextPath = "/") {
  return `/register?next=${encodeURIComponent(getSafeNextPath(nextPath))}`;
}

export function routeForPortalRole(role, nextPath = "/") {
  return String(role).toUpperCase() === "USER"
    ? getSafeNextPath(nextPath)
    : "/portal";
}
