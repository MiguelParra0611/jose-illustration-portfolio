import type { CSSProperties } from "react";
import { Logo } from "@/components/Logo";
import { HERO_COPY } from "@/lib/hero/copy";

const delay = (seconds: number) => ({ "--delay": `${seconds}s` }) as CSSProperties;

/**
 * Static title card: the very first thing on the page, in normal document
 * flow (not pinned, not tied to the hero canvas loading its frames — it
 * renders instantly). The visitor scrolls past it into the cinematic hero.
 */
export function IntroScreen() {
  return (
    <section className="flex h-svh flex-col items-center justify-center gap-7 bg-ink px-6 text-center text-white">
      <Logo title={null} className="intro-in w-[clamp(4.5rem,13vh,8rem)] text-white" style={delay(0.1)} />

      <h1
        className="intro-in font-display text-[clamp(1.75rem,6vw,3.25rem)] font-bold uppercase tracking-tight"
        style={delay(0.3)}
      >
        {HERO_COPY.intro.title}
      </h1>

      <p
        className="intro-in font-mono text-xs uppercase tracking-[0.3em] text-vermilion"
        style={delay(0.5)}
      >
        {"// "}
        {HERO_COPY.intro.status}
      </p>
    </section>
  );
}
