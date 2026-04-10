import { API_BASE_URL } from "@/lib/site";
import { normalizeRole } from "@/lib/utils";

export async function POST(request) {
  const body = await request.json();
  const fallbackBaseUrl = API_BASE_URL.includes("localhost")
    ? API_BASE_URL.replace("localhost", "127.0.0.1")
    : API_BASE_URL;
  const verifyEndpoints = [
    ...new Set([
      `${API_BASE_URL}/api/verify-otp`,
      `${fallbackBaseUrl}/api/verify-otp`,
    ]),
  ];
  let response = null;
  let lastError = null;

  for (const endpoint of verifyEndpoints) {
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
        error: `OTP verification is unavailable. Make sure the backend is running on ${API_BASE_URL}.`,
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
          "OTP verification failed. Please try again.",
      },
      { status: response.status }
    );
  }

  return Response.json({
    ...payload,
    normalizedRole: normalizeRole(payload?.role),
  });
}
