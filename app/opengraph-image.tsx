import { ImageResponse } from "next/og";
import { HERO_COPY } from "@/lib/hero/copy";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo";

/**
 * The link-preview card social apps show when this site's URL is shared
 * (Slack, LinkedIn, Discord, email…). Generated at build time with `next/og`
 * (Satori under the hood), not a static file, so it always matches the copy
 * below without a separate export step. Mirrors IntroScreen.tsx on purpose
 * (same copy, from HERO_COPY, so the two never drift) — the mask, "Behind
 * the mask" and "// Signal incoming" — rather than spelling out José's name
 * or discipline in the image itself: the real name/title is what the
 * platform shows next to the image, from `metadata.openGraph.title` in
 * layout.tsx, and a plain, mysterious card fits the brand better than a
 * second title card.
 *
 * Satori only reads ttf/otf/woff, and this site's real fonts are next/font
 * (Unbounded — no raw font file to hand it) or a woff2 subset (Shippori
 * Mincho — wrong format anyway), so this leans on Satori's built-in sans
 * instead; bold weight, uppercase and letter-spacing get it close.
 */
export const alt = "José Gutierrez — Behind the mask";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#07070d";
const PAPER = "#f6f1e9";
const VERMILION = "#e5233b";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: INK,
        }}
      >
        <svg width="140" height="140" viewBox={LOGO_VIEWBOX}>
          <path fillRule="evenodd" fill={PAPER} d={LOGO_PATH} />
        </svg>

        <p
          style={{
            margin: 0,
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: PAPER,
          }}
        >
          {HERO_COPY.intro.title}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: VERMILION,
          }}
        >
          {"// "}
          {HERO_COPY.intro.status}
        </p>
      </div>
    ),
    size,
  );
}
