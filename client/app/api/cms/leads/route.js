import { requirePortalRole } from "@/lib/portal/token";
import { API_BASE_URL } from "@/lib/site";

function validateLead(body) {
  const errors = {};

  if (!body.name?.trim()) {
    errors.name = "Name is required";
  }

  if (!body.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.email = "Enter a valid email address";
  }

  if (body.phone && !/^\+?[0-9\s-]{10,15}$/.test(body.phone)) {
    errors.phone = "Enter a valid phone number";
  }

  if (!body.message?.trim()) {
    errors.message = "Message is required";
  }

  return errors;
}

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

  const response = await fetch(`${API_BASE_URL}/admin/leads`, {
    headers: {
      Authorization: `Bearer ${access.token}`,
    },
    cache: "no-store",
  });

  const payload = await readPayload(response);
  return Response.json(payload, { status: response.status });
}

export async function POST(request) {
  const access = requirePortalRole(request, ["USER"]);
  if (!access.ok) {
    return access.response;
  }

  const body = await request.json();
  const errors = validateLead(body);

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 });
  }

  const response = await fetch(`${API_BASE_URL}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access.token}`,
    },
    body: JSON.stringify({
      name: body.name.trim(),
      company: body.company?.trim() || "",
      email: body.email.trim(),
      phone: body.phone?.trim() || "",
      serviceInterest: body.serviceInterest?.trim() || "",
      budget: body.budget?.trim() || "",
      timeline: body.timeline?.trim() || "",
      message: body.message.trim(),
      source: "website",
    }),
    cache: "no-store",
  });

  const payload = await readPayload(response);
  return Response.json(payload, { status: response.status });
}

export async function PATCH(request) {
  const access = requirePortalRole(request);
  if (!access.ok) {
    return access.response;
  }

  const { id, ...updates } = await request.json();
  if (!id) {
    return Response.json({ error: "Lead id is required" }, { status: 400 });
  }

  const response = await fetch(`${API_BASE_URL}/admin/leads/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access.token}`,
    },
    body: JSON.stringify(updates),
    cache: "no-store",
  });

  const payload = await readPayload(response);
  return Response.json(payload, { status: response.status });
}
