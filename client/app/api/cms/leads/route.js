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

  const response = await fetch(`${API_BASE_URL}/api/v1/admin/contacts`, {
    headers: {
      Authorization: `Bearer ${access.token}`,
    },
    cache: "no-store",
  });

  const payload = await readPayload(response);
  const mapped = Array.isArray(payload)
    ? payload.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.contact || "",
        serviceInterest: item.subject || "",
        message: item.message,
        status: item.isRead ? "contacted" : "new",
        createdAt: item.createdAt,
      }))
    : payload;
  return Response.json(mapped, { status: response.status });
}

export async function POST(request) {
  const body = await request.json();
  const errors = validateLead(body);

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 });
  }

  const subject = body.serviceInterest?.trim() || "General enquiry";
  const details = [
    body.company?.trim() ? `Company: ${body.company.trim()}` : null,
    body.budget?.trim() ? `Budget: ${body.budget.trim()}` : null,
    body.timeline?.trim() ? `Timeline: ${body.timeline.trim()}` : null,
    body.phone?.trim() ? `Phone: ${body.phone.trim()}` : null,
  ].filter(Boolean);
  const message = [
    body.message.trim(),
    details.length ? "" : null,
    ...details,
  ]
    .filter((item) => item !== null)
    .join("\n");

  const response = await fetch(`${API_BASE_URL}/api/v1/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: body.name.trim(),
      email: body.email.trim(),
      contact: body.phone?.trim() || "",
      subject,
      message,
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

  if (updates.status && updates.status !== "new") {
    const response = await fetch(`${API_BASE_URL}/api/v1/admin/contacts/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access.token}`,
      },
      cache: "no-store",
    });

    const payload = await readPayload(response);
    return Response.json(payload, { status: response.status });
  }

  return Response.json({ ok: true });
}
