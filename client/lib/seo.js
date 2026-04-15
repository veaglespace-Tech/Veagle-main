import {
  COMPANY_EMAIL,
  COMPANY_PHONE,
  COMPANY_NAME,
  COMPANY_LEGAL_NAME,
  COMPANY_SHORT_NAME,
  COMPANY_ADDRESS,
  COMPANY_INSTAGRAM,
  COMPANY_LINKEDIN,
  LOGO_PATH,
  SITE_URL,
} from "@/lib/site";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!path.startsWith("/")) {
    return `${SITE_URL}/${path}`;
  }

  return `${SITE_URL}${path}`;
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  type = "website",
}) {
  const url = absoluteUrl(path);
  const image = absoluteUrl(LOGO_PATH);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: COMPANY_SHORT_NAME,
      type,
      images: [
        {
          url: image,
          width: 512,
          height: 512,
          alt: COMPANY_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_LEGAL_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_PATH),
    email: COMPANY_EMAIL,
    telephone: COMPANY_PHONE,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: COMPANY_EMAIL,
        telephone: COMPANY_PHONE,
        areaServed: "IN",
        availableLanguage: ["en", "hi", "mr"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_ADDRESS,
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "411041",
      addressCountry: "IN",
    },
    sameAs: [
      COMPANY_INSTAGRAM,
      COMPANY_LINKEDIN,
    ],
  };
}

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: COMPANY_LEGAL_NAME,
    image: absoluteUrl(LOGO_PATH),
    url: SITE_URL,
    email: COMPANY_EMAIL,
    telephone: COMPANY_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_ADDRESS,
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      postalCode: "411041",
      addressCountry: "IN",
    },
    areaServed: "IN",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: COMPANY_EMAIL,
        telephone: COMPANY_PHONE,
        areaServed: "IN",
      },
    ],
  };
}

export function buildFaqSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildServiceSchema(service, path) {
  if (!service) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title || COMPANY_NAME,
    description: service.description || `Service offering from ${COMPANY_NAME}.`,
    provider: {
      "@type": "Organization",
      name: COMPANY_LEGAL_NAME,
      url: SITE_URL,
    },
    areaServed: "IN",
    serviceType: service.title || "Business service",
    url: absoluteUrl(path),
    image: service.imageUrl ? absoluteUrl(service.imageUrl) : absoluteUrl(LOGO_PATH),
  };
}

export function buildProductSchema(product, path) {
  if (!product) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title || COMPANY_NAME,
    description: product.description || `Product offering from ${COMPANY_NAME}.`,
    category: product.categoryName || "Business solutions",
    brand: {
      "@type": "Brand",
      name: COMPANY_NAME,
    },
    manufacturer: {
      "@type": "Organization",
      name: COMPANY_LEGAL_NAME,
      url: SITE_URL,
    },
    url: absoluteUrl(path),
    image: product.imageUrl ? absoluteUrl(product.imageUrl) : absoluteUrl(LOGO_PATH),
  };
}
