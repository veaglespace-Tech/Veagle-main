import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import ThemeProvider, { themeInitScript } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
import {
  COMPANY_NAME,
  COMPANY_SHORT_NAME,
  COMPANY_TAGLINE,
  LOGO_PATH,
  SITE_URL,
} from "@/lib/site";
import ReduxProvider from "@/store/provider";
import "./globals.css";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: COMPANY_NAME,
    template: `%s | ${COMPANY_SHORT_NAME}`,
  },
  description: COMPANY_TAGLINE,
  keywords: [
    "software development company in Pune",
    "website development company in Pune",
    "dynamic website development Pune",
    "e-commerce website development Pune",
    "ERP software development Pune",
    "mobile app development Pune",
    "digital marketing company Pune",
    "SEO services Pune",
    COMPANY_NAME,
  ],
  openGraph: {
    title: COMPANY_NAME,
    description: COMPANY_TAGLINE,
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
    description: COMPANY_TAGLINE,
    images: [LOGO_PATH],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`antialiased ${inter.variable} ${jakarta.variable}`}
    >
      <body className="min-h-screen bg-[color:var(--page-bg)] font-sans text-[color:var(--text-primary)]">
        <script
          id="veagle-theme-init"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ReduxProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
