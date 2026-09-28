import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Unbounded } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

// Display face for the hero headline (wide, futuristic).
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display: "swap",
});

// Cryptic corner text / HUD details.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

// Vertical kanji. Trimmed to the glyphs used in lib/hero/copy.ts (npm run subset:font).
const shipporiMincho = localFont({
  src: "./fonts/shippori-mincho-subset.woff2",
  variable: "--font-mincho",
  weight: "700",
  display: "swap",
});

// Body text for the light section.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "José Gutierrez - Concept Art Portfolio";
const DESCRIPTION =
  "José Gutierrez — junior concept artist focused on sci-fi splash art and character design. Have a project in mind? Get in touch and let's work together.";

// The shorter of the project's two production aliases (see reference-portfolio-hosting
// memory) — swap for the real domain once there is one. Needed to resolve the
// app/opengraph-image.tsx card (see there for why it doesn't use the site's real
// fonts) to an absolute URL for `og:image`/`twitter:image`.
const SITE_URL = "https://jose-illustration-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // Every `*.vercel.app` deployment sends `x-robots-tag: noindex` regardless of this
  // (see reference-portfolio-hosting memory), so this has no effect until a custom
  // domain replaces SITE_URL — set correctly now so nothing needs to change then.
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: TITLE,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#07070d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${jetbrainsMono.variable} ${shipporiMincho.variable} ${dmSans.variable} antialiased`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
