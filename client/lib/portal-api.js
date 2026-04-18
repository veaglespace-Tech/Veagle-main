import { API_BASE_URL } from "@/lib/site";
import { mapLeadRecord } from "@/lib/leads";
export { PORTAL_STORAGE_KEY } from "@/lib/auth-session";

export async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(
      typeof payload === "string"
        ? payload
        : payload.error || payload.message || "Request failed"
    );
    error.status = response.status;
    error.payload = payload;
    throw error;
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
  const primaryResults = await Promise.allSettled([
    requestJson(`${API_BASE_URL}/api/public/site-content`, {
      headers: authHeaders(session.token, false),
    }),
    requestJson(`${API_BASE_URL}/api/admin/contacts`, {
      headers: authHeaders(session.token, false),
    }),
    requestJson(`${API_BASE_URL}/api/admin/tasks`, {
      headers: authHeaders(session.token, false),
    }),
  ]);

  const [content, rawLeads, tasks] = primaryResults.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    return [{}, [], []][index];
  });
  const leads = Array.isArray(rawLeads) ? rawLeads.map((item) => mapLeadRecord(item)) : [];

  const results = await Promise.allSettled([
    requestJson(`${API_BASE_URL}/api/public/services`),
    requestJson(`${API_BASE_URL}/api/public/products`),
    requestJson(`${API_BASE_URL}/api/public/categories`),
    requestJson(`${API_BASE_URL}/api/public/jobs`),
    requestJson(`${API_BASE_URL}/api/public/clients`),
    requestJson(`${API_BASE_URL}/api/public/portfolio`),
    requestJson(`${API_BASE_URL}/api/admin/applications`, {
      headers: authHeaders(session.token, false),
    }),
    session.role === "SADMIN"
      ? requestJson(`${API_BASE_URL}/api/admin/users`, {
          headers: authHeaders(session.token, false),
        })
      : Promise.resolve([]),
  ]);

  const [services, products, categories, jobs, clients, portfolio, applications, users] = results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    return [[], [], [], [], [], [], [], []][index];
  });

  return {
    content,
    leads,
    tasks,
    services,
    products,
    categories,
    jobs,
    clients,
    portfolio,
    applications,
    users,
    authExpired:
      primaryResults.some(
        (result) =>
          result.status === "rejected" &&
          (result.reason?.status === 401 || result.reason?.status === 403)
      ) ||
      results.some(
        (result) =>
          result.status === "rejected" &&
          (result.reason?.status === 401 || result.reason?.status === 403)
      ),
    fallbackUsed:
      primaryResults.some((result) => result.status === "rejected") ||
      results.some((result) => result.status === "rejected"),
  };
}
