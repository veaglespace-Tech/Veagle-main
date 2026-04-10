import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_SHORT_NAME,
  COMPANY_ADDRESS,
  COMPANY_INSTAGRAM,
  COMPANY_LINKEDIN,
  LOGO_PATH,
  SITE_URL,
} from "@/lib/site";

export function absoluteUrl(path = "/") {
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
    name: COMPANY_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_PATH),
    email: COMPANY_EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: COMPANY_EMAIL,
        areaServed: "IN",
        availableLanguage: ["en", "hi", "mr"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Kudale Patil Tower, Office No. 207, 2nd Floor, Jadhav Nagar, Near Shiv Temple, Vadgaon Budruk",
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
    name: COMPANY_NAME,
    image: absoluteUrl(LOGO_PATH),
    url: SITE_URL,
    email: COMPANY_EMAIL,
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
