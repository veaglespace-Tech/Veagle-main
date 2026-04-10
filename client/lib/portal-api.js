import { API_BASE_URL } from "@/lib/site";
export { PORTAL_STORAGE_KEY } from "@/lib/auth-session";

export async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof payload === "string"
        ? payload
        : payload.error || payload.message || "Request failed"
    );
  }

  return payload;
}

export function authHeaders(token, isJson = true) {
  return {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchPortalDashboard(session) {
  const [content, leads, tasks] = await Promise.all([
    requestJson("/api/cms/content", {
      headers: authHeaders(session.token, false),
    }),
    requestJson("/api/cms/leads", {
      headers: authHeaders(session.token, false),
    }),
    requestJson("/api/cms/tasks", {
      headers: authHeaders(session.token, false),
    }),
  ]);

  const results = await Promise.allSettled([
    requestJson(`${API_BASE_URL}/api/services`),
    requestJson(`${API_BASE_URL}/api/products`),
    requestJson(`${API_BASE_URL}/api/categories`),
    requestJson(`${API_BASE_URL}/api/jobs`),
    session.role === "SADMIN"
      ? requestJson(`${API_BASE_URL}/admin/users`, {
          headers: authHeaders(session.token, false),
        })
      : Promise.resolve([]),
  ]);

  const [services, products, categories, jobs, users] = results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    return [[], [], [], [], []][index];
  });

  return {
    content,
    leads,
    tasks,
    services,
    products,
    categories,
    jobs,
    users,
    fallbackUsed: results.some((result) => result.status === "rejected"),
  };
}
