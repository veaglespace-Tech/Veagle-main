import { AUTH_BACKEND_ROUTES, buildAuthBackendCandidates } from "@/lib/auth-routes";
import { API_BASE_URL } from "@/lib/site";
import { normalizeRole } from "@/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const loginEndpoints = buildAuthBackendCandidates(AUTH_BACKEND_ROUTES.login);
    let response = null;
    let lastError = null;

    for (const endpoint of loginEndpoints) {
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
      } catch (error) {
        lastError = error;
        continue;
      }

      if (response.status !== 404) {
        break;
      }
    }

    if (!response) {
      return Response.json(
        {
          error: `Authentication service is unavailable. Make sure the backend is running on ${API_BASE_URL}.`,
          detail: lastError?.cause?.code || lastError?.message || "",
        },
        { status: 503 }
      );
    }

    const rawText = await response.text();
    let payload = null;

    if (rawText) {
      try {
        payload = JSON.parse(rawText);
      } catch {
        payload = null;
      }
    }

    if (!response.ok) {
      return Response.json(
        {
          error:
            payload?.message ||
            payload?.error ||
            rawText ||
            "Login failed. Please verify your credentials.",
        },
        { status: response.status }
      );
    }

    if (typeof payload === "string") {
      return Response.json({
        message: payload,
        otpRequired: true,
      });
    }

    if (!payload && rawText) {
      return Response.json({
        message: rawText,
        otpRequired: true,
      });
    }

    return Response.json({
      ...payload,
      normalizedRole: normalizeRole(payload?.normalizedRole || payload?.role),
    });
  } catch {
    return Response.json(
      {
        error: "Invalid login request payload.",
      },
      { status: 400 }
    );
  }
}
