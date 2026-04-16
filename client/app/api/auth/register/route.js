import { AUTH_BACKEND_ROUTES, buildAuthBackendCandidates } from "@/lib/auth-routes";
import { API_BASE_URL } from "@/lib/site";

export async function POST(request) {
  const body = await request.json();
  const registerEndpoints = buildAuthBackendCandidates(
    AUTH_BACKEND_ROUTES.register
  );
  let response = null;
  let lastError = null;

  for (const endpoint of registerEndpoints) {
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
        error: `Registration service is unavailable. Make sure the backend is running on ${API_BASE_URL}.`,
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
          "Registration failed. Please verify the details and try again.",
      },
      { status: response.status }
    );
  }

  return Response.json(payload, { status: response.status });
}
