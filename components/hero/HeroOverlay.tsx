import type { CSSProperties } from "react";
import { Logo } from "@/components/Logo";
import { HERO_FRAMES } from "@/lib/hero/config";
import { HERO_COPY } from "@/lib/hero/copy";
import { HeroCta } from "./HeroCta";

/**
 * Copy that isn't on the first frame starts hidden so the server-rendered
 * HTML never shows all of it stacked. The overlay controller takes over once
 * the hero is ready.
 */
const HIDDEN: CSSProperties = { visibility: "hidden", opacity: 0 };

const startsHidden = (frame: number): CSSProperties | undefined => (frame === 0 ? undefined : HIDDEN);

const delay = (seconds: number) => ({ "--delay": `${seconds}s` }) as CSSProperties;

const pad = (n: number) => String(n).padStart(2, "0");

const HUD = "font-mono text-[11px] uppercase tracking-[0.2em] text-white/70";

/**
 * Everything layered over the canvas. Each `data-hero-frame="N"` element is
 * faded in and out by `createOverlayController`, so it only shows while frame N
 * is on screen. Elements that share a corner are stacked in one grid cell.
 */
export function HeroOverlay() {
  const total = HERO_FRAMES.length;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-white">
      {/* Top left: frame counter. */}
      <div className="absolute left-[var(--gutter)] top-[var(--gutter)] grid">
        {HERO_FRAMES.map((_, i) => (
          <p
            key={i}
            data-hero-frame={i}
            style={startsHidden(i)}
            className={`${HUD} tracking-[0.25em] [grid-area:1/1]`}
          >
            {pad(i + 1)} <span className="text-vermilion">/</span> {pad(total)}
          </p>
        ))}
      </div>

      {/* Top right: the seal. */}
      <div className="absolute right-[var(--gutter)] top-[var(--gutter)]">
        <div data-hero-frame={0}>
          <Logo title={null} className="hero-stamp w-[clamp(3rem,6vw,5rem)] text-white" />
        </div>
      </div>

      {/* Centre: vertical kanji that covers the figure's face until the camera moves in. */}
      <div className="absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2">
        <p
          data-hero-frame={0}
          data-hero-effect="curtain"
          lang="ja"
          aria-hidden="true"
          className="font-jp text-[clamp(1.5rem,min(6.5vh,11vw),6rem)] font-bold leading-none tracking-[0.18em] whitespace-nowrap text-white/95 [text-shadow:0_0_36px_rgba(0,0,0,0.55)] [writing-mode:vertical-rl]"
        >
          <span className="hero-in block" style={delay(0.7)}>
            {HERO_COPY.curtain}
          </span>
        </p>
      </div>

      {/* Right edge: one small vertical kanji per frame. */}
      <div className="absolute right-[var(--gutter)] top-1/2 grid -translate-y-1/2">
        {Object.entries(HERO_COPY.edgeKanji).map(([frame, kanji]) => (
          <p
            key={frame}
            data-hero-frame={frame}
            style={startsHidden(Number(frame))}
            lang="ja"
            aria-hidden="true"
            className="font-jp text-[clamp(1.25rem,2.4vw,2rem)] tracking-[0.3em] text-white/80 [grid-area:1/1] [writing-mode:vertical-rl]"
          >
            {kanji}
          </p>
        ))}
      </div>

      {/* Bottom left: headline, then the portfolio line, then the call to action. */}
      <div className="absolute bottom-[var(--gutter)] left-[var(--gutter)] grid max-w-[90%] items-end">
        <p
          data-hero-frame={0}
          className="font-display text-[clamp(2rem,min(7.2vw,13vh),6.5rem)] font-bold uppercase leading-[0.92] tracking-tight [grid-area:1/1]"
        >
          {HERO_COPY.tagline.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span className="hero-line" style={delay(0.95 + i * 0.14)}>
                {line}
              </span>
            </span>
          ))}
        </p>

        <p
          data-hero-frame={2}
          style={HIDDEN}
          className="font-display text-[clamp(0.9rem,1.6vw,1.25rem)] tracking-wide [grid-area:1/1]"
        >
          {HERO_COPY.portfolio}
        </p>

        <div data-hero-frame={3} style={HIDDEN} className="[grid-area:1/1]">
          <HeroCta />
        </div>
      </div>

      {/* Bottom right: vertical scroll cue, first frame only. */}
      <div
        data-hero-frame={0}
        className="absolute bottom-[var(--gutter)] right-[var(--gutter)] flex flex-col items-center gap-3"
      >
        <span className={`${HUD} hero-in [writing-mode:vertical-rl]`} style={delay(1.5)}>
          {HERO_COPY.scrollCue}
        </span>
        <span aria-hidden="true" className="hero-scroll-line block h-10 w-px bg-white/60" />
      </div>

      {/* Cryptic HUD lines. Top right on phones (the bottom row is full), bottom right from sm up. */}
      <div className="absolute right-[var(--gutter)] top-[var(--gutter)] grid items-end justify-items-end text-right sm:top-auto sm:bottom-[var(--gutter)]">
        <p data-hero-frame={1} style={HIDDEN} className={`${HUD} [grid-area:1/1]`}>
          <span className="text-vermilion">●</span> {HERO_COPY.subjectLocated}
        </p>

        <p data-hero-frame={2} style={HIDDEN} className={`${HUD} [grid-area:1/1]`}>
          {HERO_COPY.signal.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <p data-hero-frame={3} style={HIDDEN} className={`${HUD} [grid-area:1/1]`}>
          {HERO_COPY.endOfSignal}
        </p>
      </div>
    </div>
  );
}
