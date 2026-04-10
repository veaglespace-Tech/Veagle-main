import ThemeProvider, { themeInitScript } from "@/components/ThemeProvider";
import { COMPANY_NAME, COMPANY_SHORT_NAME, LOGO_PATH, SITE_URL } from "@/lib/site";
import ReduxProvider from "@/store/provider";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: COMPANY_NAME,
    template: `%s | ${COMPANY_SHORT_NAME}`,
  },
  description:
    `${COMPANY_NAME} delivers software development, dynamic websites, ERP systems, admin dashboards, digital marketing and growth-ready business experiences from Pune.`,
  keywords: [
    "software development company Pune",
    "dynamic website development Pune",
    "admin dashboard development",
    "ERP system development Pune",
    "digital marketing company Pune",
    "SEO services Pune",
    COMPANY_NAME,
  ],
  openGraph: {
    title: COMPANY_NAME,
    description:
      `Dynamic websites, software systems, ERP and admin dashboard experiences from ${COMPANY_NAME}.`,
    url: SITE_URL,
    siteName: COMPANY_SHORT_NAME,
    type: "website",
    images: [
      {
        url: LOGO_PATH,
        width: 512,
        height: 512,
        alt: COMPANY_NAME,
      },
    ],
  },
  icons: {
    icon: LOGO_PATH,
    shortcut: LOGO_PATH,
    apple: LOGO_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: COMPANY_NAME,
    description:
      `Dynamic websites, software systems and dashboard experiences for growth-focused businesses from ${COMPANY_NAME}.`,
    images: [LOGO_PATH],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className="antialiased"
    >
      <head>
        <script
          id="veagle-theme-init"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="min-h-screen bg-[color:var(--page-bg)] font-sans text-[color:var(--text-primary)]">
        <ReduxProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
