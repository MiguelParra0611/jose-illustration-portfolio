"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Logo } from "@/components/Logo";
import { Atmosphere } from "@/components/hero/Atmosphere";
import { HeroOverlay } from "@/components/hero/HeroOverlay";
import {
  HERO_BLUR_RADIUS,
  HERO_FRAMES,
  HERO_OVERSCAN,
  HERO_SCROLL_SVH,
  HERO_SMOOTHING_SECONDS,
  HERO_TIMELINE,
} from "@/lib/hero/config";
import { createOverlayController } from "@/lib/hero/overlay";
import {
  createHeroRenderer,
  loadHeroAssets,
  releaseHeroAssets,
  type HeroRenderer,
} from "@/lib/hero/renderer";
import { computeHeroState } from "@/lib/hero/timeline";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void): () => void {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/**
 * Pinned, scroll-driven cinematic intro. A tall section holds a sticky
 * full-screen canvas; scroll progress through the section drives the frames.
 * People who prefer reduced motion get the final frame, still, with no pin.
 */
export function ScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  const [loadedFraction, setLoadedFraction] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    if (!section || !canvas || !sticky) return;

    let disposed = false;
    let renderer: HeroRenderer | null = null;
    let trigger: ScrollTrigger | null = null;
    let observer: ResizeObserver | null = null;
    let tick: ((time: number, deltaMs: number) => void) | null = null;

    loadHeroAssets(HERO_FRAMES, HERO_BLUR_RADIUS, (loaded, total) => {
      if (!disposed) setLoadedFraction(loaded / total);
    })
      .then((assets) => {
        if (disposed) {
          releaseHeroAssets(assets);
          return;
        }

        const heroRenderer = createHeroRenderer(canvas, assets, { overscan: HERO_OVERSCAN });
        renderer = heroRenderer;

        const overlay = createOverlayController(sticky);

        if (reducedMotion) {
          const state = computeHeroState(1, HERO_TIMELINE);
          heroRenderer.render(state);
          overlay.update(state);
        } else {
          let target = 0;
          let current = 0;
          let drawn = -1;

          trigger = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              target = self.progress;
            },
          });

          target = current = trigger.progress;

          tick = (_time, deltaMs) => {
            const dt = Math.min(deltaMs, 100) / 1000;
            current += (target - current) * (1 - Math.exp(-dt / HERO_SMOOTHING_SECONDS));
            if (Math.abs(target - current) < 0.00005) current = target;

            if (current !== drawn) {
              const state = computeHeroState(current, HERO_TIMELINE);
              heroRenderer.render(state);
              overlay.update(state);
              drawn = current;
            }
          };
          gsap.ticker.add(tick);
        }

        observer = new ResizeObserver(() => heroRenderer.resize());
        observer.observe(canvas);

        setReady(true);
      })
      .catch((error: unknown) => {
        // Without frames the page still works: the loader stays up and scrolling continues.
        console.error("Hero frames failed to load", error);
      });

    return () => {
      disposed = true;
      if (tick) gsap.ticker.remove(tick);
      trigger?.kill();
      observer?.disconnect();
      renderer?.destroy();
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      data-ready={ready}
      className="relative"
      style={{ height: reducedMotion ? "100svh" : `${HERO_SCROLL_SVH}svh` }}
    >
      <h1 className="sr-only">Illustration portfolio</h1>

      <div ref={stickyRef} className="sticky top-0 h-svh w-full overflow-hidden bg-ink">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <Atmosphere />
        <HeroOverlay />

        <div
          aria-hidden={ready}
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-ink transition-opacity duration-700 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <Logo title={null} className="w-20 animate-pulse text-white" />
          <p className="font-mono text-xs tracking-[0.2em] text-fog">
            {String(Math.round(loadedFraction * 100)).padStart(3, "0")}%
          </p>
        </div>
      </div>
    </section>
  );
}
