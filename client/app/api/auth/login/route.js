import { API_BASE_URL } from "@/lib/site";
import { normalizeRole } from "@/lib/utils";

export async function POST(request) {
  const body = await request.json();
  const fallbackBaseUrl = API_BASE_URL.includes("localhost")
    ? API_BASE_URL.replace("localhost", "127.0.0.1")
    : API_BASE_URL;
  const loginEndpoints = [
    ...new Set([
      `${API_BASE_URL}/auth/login`,
      `${API_BASE_URL}/login`,
      `${fallbackBaseUrl}/auth/login`,
      `${fallbackBaseUrl}/login`,
    ]),
  ];
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

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    return Response.json(
      {
        error:
          payload?.message ||
          payload?.error ||
          "Login failed. Please verify your credentials.",
      },
      { status: response.status }
    );
  }

  return Response.json({
    ...payload,
    normalizedRole: normalizeRole(payload?.role),
  });
}
