import { requirePortalRole } from "@/lib/portal/token";
import { API_BASE_URL } from "@/lib/site";

async function readPayload(response) {
  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json")
    ? response.json()
    : response.text();
}

export async function GET(request) {
  const access = requirePortalRole(request);
  if (!access.ok) {
    return access.response;
  }

  const response = await fetch(`${API_BASE_URL}/api/public/site-content`, {
    cache: "no-store",
  });
  const payload = await readPayload(response);

  return Response.json(payload, { status: response.status });
}

export async function PUT(request) {
  const access = requirePortalRole(request);
  if (!access.ok) {
    return access.response;
  }

  const body = await request.json();
  const response = await fetch(`${API_BASE_URL}/api/admin/site-content`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${access.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const payload = await readPayload(response);

  return Response.json(payload, { status: response.status });
}
