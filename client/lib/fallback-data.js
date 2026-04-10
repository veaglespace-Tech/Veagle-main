import { slugify } from "@/lib/utils";

export function resolveClientProfile(value) {
  if (typeof value === "string") {
    const name = value.trim();
    return name ? { name, href: "", image: "" } : null;
  }

  if (value && typeof value === "object") {
    const name = (value.name || value.label || "").trim();
    if (!name) {
      return null;
    }

    return {
      name,
      href: value.href || value.url || "",
      image: value.image || value.img || "",
    };
  }

  return null;
}

export function withServiceSlugs(services) {
  return services.map((service) => ({
    ...service,
    slug: service.slug || slugify(service.title),
  }));
}
