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

  const response = await fetch(`${API_BASE_URL}/admin/tasks`, {
    headers: {
      Authorization: `Bearer ${access.token}`,
    },
    cache: "no-store",
  });

  const payload = await readPayload(response);
  return Response.json(payload, { status: response.status });
}

export async function POST(request) {
  const access = requirePortalRole(request);
  if (!access.ok) {
    return access.response;
  }

  const body = await request.json();

  if (!body.title?.trim()) {
    return Response.json({ error: "Task title is required" }, { status: 422 });
  }

  const response = await fetch(`${API_BASE_URL}/admin/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access.token}`,
    },
    body: JSON.stringify({
      title: body.title.trim(),
      section: body.section?.trim() || "Homepage",
      priority: body.priority || "medium",
      assignedTo: body.assignedTo || "",
      summary: body.summary?.trim() || "",
      status: body.status || "todo",
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
    return Response.json({ error: "Task id is required" }, { status: 400 });
  }

  const response = await fetch(`${API_BASE_URL}/admin/tasks/${id}`, {
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

export async function DELETE(request) {
  const access = requirePortalRole(request);
  if (!access.ok) {
    return access.response;
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Task id is required" }, { status: 400 });
  }

  const response = await fetch(`${API_BASE_URL}/admin/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${access.token}`,
    },
    cache: "no-store",
  });

  const payload = await readPayload(response);
  return Response.json(payload, { status: response.status });
}
