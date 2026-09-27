import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Unbounded } from "next/font/google";
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

// Body text for the light section.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "José Gutierrez - Illustration Portfolio",
  description:
    "José Gutierrez — junior concept artist focused on sci-fi splash art and character design. Have a project in mind? Get in touch and let's work together.",
};

export const viewport: Viewport = {
  themeColor: "#07070d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${jetbrainsMono.variable} ${dmSans.variable} antialiased`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
