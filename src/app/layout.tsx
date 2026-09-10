import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Figtree, Fraunces } from "next/font/google";
import Script from "next/script";
import { SiteShell } from "@/components/SiteShell";
import { absoluteUrl, site } from "@/lib/site";
import { teamThemeBootScript } from "@/lib/team-theme";
import { spoilerFreeBootScript } from "@/lib/spoiler-storage";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: `${site.name} NFL: learn American football in the UK`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "NFL",
    "learn NFL",
    "NFL for beginners",
    "UK",
    "Scotland",
    "American football",
    "NFL community Scotland",
    "meet NFL fans UK",
    "NFL team news UK",
    "where to watch NFL UK",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} NFL: learn American football in the UK`,
    description: site.description,
    locale: "en_GB",
    type: "website",
    siteName: site.name,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} NFL`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} NFL: learn American football in the UK`,
    description: site.description,
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    title: site.shortName,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1220",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${figtree.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        {/* Native head tag so AdSense crawlers see the publisher client in the initial HTML. */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1747465358377243"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full font-sans">
        <Script id="fds-team-theme" strategy="beforeInteractive">
          {teamThemeBootScript()}
        </Script>
        <Script id="fds-spoiler-free" strategy="beforeInteractive">
          {spoilerFreeBootScript()}
        </Script>
        <SiteShell>{children}</SiteShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
