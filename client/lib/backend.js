import {
  withServiceSlugs,
} from "@/lib/fallback-data";
import { API_BASE_URL } from "@/lib/site";
import { slugify } from "@/lib/utils";
import {
  resolveProductIllustration,
  resolveServiceIllustration,
} from "@/lib/visuals";

export function backendAssetUrl(value) {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (/^\/?uploads\//i.test(value)) {
    return `${API_BASE_URL}${value.startsWith("/") ? value : `/${value}`}`;
  }

  return value;
}

async function fetchJson(path, fallback, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return await response.json();
  } catch {
    return fallback;
  }
}

function mapServices(services) {
  return withServiceSlugs(services).map((service) => ({
    ...service,
    imageUrl:
      backendAssetUrl(service.imageUrl) ||
      service.imageUrl ||
      resolveServiceIllustration(service.title),
    slug: service.slug || slugify(service.title),
  }));
}

function mapProducts(products) {
  return products.map((product) => ({
    ...product,
    imageUrl:
      backendAssetUrl(product.imageUrl) ||
      product.imageUrl ||
      resolveProductIllustration(product.title),
  }));
}

export async function getServices(keyword = "") {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
  const services = await fetchJson(`/api/v1/services${query}`, []);
  return mapServices(services);
}

export async function getServiceBySlug(slug) {
  const services = await getServices();
  return services.find((service) => service.slug === slug) || null;
}

export async function getProducts() {
  const products = await fetchJson("/api/v1/products", []);
  return mapProducts(products);
}

export async function getCategories() {
  return fetchJson("/api/v1/categories", []);
}

export async function getJobs(keyword = "") {
  const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
  return fetchJson(`/api/v1/jobs${query}`, []);
}

export async function getClients() {
  return fetchJson("/api/v1/clients", []);
}

export async function getPortfolio() {
  return fetchJson("/api/v1/portfolio", []);
}

export async function postContact(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await safeReadMessage(response);
    throw new Error(message || "Unable to send your message right now.");
  }

  try {
    return await response.json();
  } catch {
    return response.text();
  }
}

export async function postJobApplication(formData, token) {
  const response = await fetch(`${API_BASE_URL}/api/v1/applications`, {
    method: "POST",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    body: formData,
  });

  if (!response.ok) {
    const message = await safeReadMessage(response);
    throw new Error(message || "Unable to submit application right now.");
  }

  return response.json();
}

export async function safeReadMessage(response) {
  try {
    const data = await response.json();
    return data?.message || data?.error || null;
  } catch {
    return null;
  }
}
