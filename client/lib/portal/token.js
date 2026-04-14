import { NextResponse } from "next/server";

import { decodeJwtPayload, isJwtExpired, normalizeRole } from "@/lib/utils";

export function getRoleFromToken(token) {
  const payload = decodeJwtPayload(token);
  return normalizeRole(payload?.role || payload?.authorities?.[0] || "");
}

export function getTokenFromRequest(request) {
  const header = request.headers.get("authorization") || "";
  if (!header.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  return header.slice(7).trim();
}

export function requirePortalRole(request, allowedRoles = ["ADMIN", "SADMIN"]) {
  const token = getTokenFromRequest(request);
  if (!token || isJwtExpired(token)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Portal session expired. Please sign in again." },
        { status: 401 }
      ),
    };
  }

  const role = getRoleFromToken(token);

  if (!allowedRoles.includes(role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized portal request" },
        { status: 401 }
      ),
    };
  }

  return { ok: true, token, role };
}
