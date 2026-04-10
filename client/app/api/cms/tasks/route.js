import {
  createPortalTask,
  deletePortalTask,
  readPortalTasks,
  updatePortalTask,
} from "@/lib/cms/local-store";
import { requirePortalRole } from "@/lib/portal/token";

function forbidIfNotSuperadmin(access) {
  if (access.role === "SADMIN") {
    return null;
  }

  return Response.json(
    { error: "Only superadmin can manage task records." },
    { status: 403 }
  );
}

export async function GET(request) {
  const access = requirePortalRole(request);
  if (!access.ok) {
    return access.response;
  }

  const tasks = await readPortalTasks();
  return Response.json(tasks);
}

export async function POST(request) {
  const access = requirePortalRole(request);
  if (!access.ok) {
    return access.response;
  }

  const forbiddenResponse = forbidIfNotSuperadmin(access);
  if (forbiddenResponse) {
    return forbiddenResponse;
  }

  const body = await request.json();

  if (!body.title?.trim()) {
    return Response.json({ error: "Task title is required" }, { status: 422 });
  }

  const task = await createPortalTask({
    title: body.title.trim(),
    section: body.section?.trim() || "Homepage",
    priority: body.priority || "medium",
    assignedTo: body.assignedTo || "",
    summary: body.summary?.trim() || "",
    status: body.status || "todo",
  });

  return Response.json(task, { status: 201 });
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

  try {
    const task = await updatePortalTask(id, updates);
    return Response.json(task);
  } catch (error) {
    return Response.json(
      { error: error.message || "Unable to update task." },
      { status: 404 }
    );
  }
}

export async function DELETE(request) {
  const access = requirePortalRole(request);
  if (!access.ok) {
    return access.response;
  }

  const forbiddenResponse = forbidIfNotSuperadmin(access);
  if (forbiddenResponse) {
    return forbiddenResponse;
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Task id is required" }, { status: 400 });
  }

  try {
    await deletePortalTask(id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: error.message || "Unable to delete task." },
      { status: 404 }
    );
  }
}
