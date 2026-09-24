"use client";

import type { MouseEvent } from "react";
import { HERO_COPY } from "@/lib/hero/copy";
import { getLenis } from "@/lib/lenis";

/** Call to action shown on the last frame. Scrolls smoothly to the contact block. */
export function HeroCta() {
  const { label, note, target } = HERO_COPY.cta;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const lenis = getLenis();
    // Without Lenis (reduced motion) the native anchor jump does the job.
    if (!lenis) return;

    event.preventDefault();
    lenis.scrollTo(target, { duration: 1.8 });
  }

  return (
    <a
      href={target}
      onClick={handleClick}
      className="group pointer-events-auto flex flex-col items-start gap-2 outline-offset-8 focus-visible:outline-2 focus-visible:outline-vermilion"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/80">
        <span className="text-vermilion">●</span> Open for commissions
      </span>
      <span className="font-display text-[clamp(1.5rem,4.5vw,3.5rem)] font-bold uppercase leading-none tracking-tight">
        {label}{" "}
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-300 group-hover:translate-x-2"
        >
          →
        </span>
      </span>
      <span lang="ja" className="font-jp text-sm tracking-[0.3em] text-white/70">
        {note}
      </span>
    </a>
  );
}
