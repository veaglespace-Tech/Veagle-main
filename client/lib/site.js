export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.veaglespace.com";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const COMPANY_NAME = "Veagle Space";
export const COMPANY_LEGAL_NAME = "Veagle Space Technology Pvt. Ltd.";
export const COMPANY_SHORT_NAME = COMPANY_NAME;
export const COMPANY_BRAND_NAME = COMPANY_NAME;
export const COMPANY_TAGLINE =
  "Software development, dynamic website design, ERP systems, digital marketing and business support services from Pune.";
export const LOGO_PATH = "/veagle-logo.webp";

export const COMPANY_EMAIL = "info@veaglespace.com";
export const COMPANY_EMAIL_LINK = `mailto:${COMPANY_EMAIL}`;
export const COMPANY_PHONE = "+91 82379 99101";
export const COMPANY_PHONE_LINK = "tel:+918237999101";
export const COMPANY_ADDRESS =
  "Office no 207, Kudale Patil Chambers, Heritage, near Bhairavnath Temple, Jadhav Nagar, Vadgaon Budruk, Pune, Maharashtra 411041";
export const COMPANY_LOCATION_LABEL = "Pune, Maharashtra";
const COMPANY_ADDRESS_ENCODED = encodeURIComponent(COMPANY_ADDRESS);
export const COMPANY_ADDRESS_QUERY =
  `https://www.google.com/maps/search/?api=1&query=${COMPANY_ADDRESS_ENCODED}`;
export const COMPANY_MAP_EMBED_URL =
  `https://www.google.com/maps?q=${COMPANY_ADDRESS_ENCODED}&z=17&output=embed`;
export const COMPANY_WHATSAPP =
  "https://api.whatsapp.com/send/?phone=918237999101&text&type=phone_number&app_absent=0";
export const COMPANY_FACEBOOK =
  "https://www.facebook.com/VeagleSpaceTech?rdid=AEunqlJ6eupxXlET&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16nA91LmG3%2F#";
export const COMPANY_INSTAGRAM =
  "https://www.instagram.com/veagle_space_tech?igsh=b3ZnZW5pM3IwZGtj";
export const COMPANY_LINKEDIN =
  "https://www.linkedin.com/company/veagle-space-technology-pvt-ltd/";

export const COMPANY_NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact Us" },
];
