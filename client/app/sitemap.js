import { getProducts, getServices } from "@/lib/backend";
import { SITE_URL } from "@/lib/site";
import { slugify } from "@/lib/utils";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/products",
  "/portfolio",
  "/clients",
  "/career",
  "/contact",
  "/login",
  "/register",
];

export default async function sitemap() {
  const [services, products] = await Promise.all([getServices(), getProducts()]);

  const staticEntries = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const serviceEntries = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productEntries = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug || slugify(product.title || "product")}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...serviceEntries, ...productEntries];
}
