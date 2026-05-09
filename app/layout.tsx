import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Main } from "@/components/layout/main";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers";
import { OrganizationJsonLd, PodcastSeriesJsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf8f5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-luxury-bg font-sans antialiased text-luxury-body selection:bg-brand-gold/25 selection:text-luxury-heading">
        <OrganizationJsonLd />
        <PodcastSeriesJsonLd />
        <Providers>
          <Navbar />
          <Main>{children}</Main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
