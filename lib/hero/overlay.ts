import { frameTextPhase, type HeroState } from "./timeline";

/** How far copy drifts (px) and how much it blurs while entering or leaving. */
const DRIFT_PX = 14;
const BLUR_PX = 6;

interface OverlayItem {
  el: HTMLElement;
  frame: number;
  /** The kanji "curtain" also swells a little as it dissolves. */
  curtain: boolean;
}

export interface OverlayController {
  update(state: HeroState): void;
}

/**
 * Drives the text layered over the hero. Every element marked
 * `data-hero-frame="N"` belongs to frame N and is faded, drifted and blurred
 * according to the scroll state. Writes styles straight to the DOM so scrolling
 * never triggers a React render.
 */
export function createOverlayController(root: HTMLElement): OverlayController {
  const items: OverlayItem[] = Array.from(
    root.querySelectorAll<HTMLElement>("[data-hero-frame]"),
  ).map((el) => ({
    el,
    frame: Number(el.dataset.heroFrame),
    curtain: el.dataset.heroEffect === "curtain",
  }));

  return {
    update(state) {
      for (const { el, frame, curtain } of items) {
        const { opacity, offset } = frameTextPhase(state, frame);
        const style = el.style;

        if (opacity <= 0.01) {
          // Hidden also removes it from the accessibility tree and blocks clicks.
          style.visibility = "hidden";
          style.opacity = "0";
          continue;
        }

        const distance = Math.abs(offset);
        style.visibility = "visible";
        style.opacity = opacity.toFixed(3);
        style.transform = curtain
          ? `translateY(${(offset * DRIFT_PX).toFixed(2)}px) scale(${(1 + 0.18 * distance).toFixed(3)})`
          : `translateY(${(offset * DRIFT_PX).toFixed(2)}px)`;
        style.filter = distance > 0.01 ? `blur(${(distance * BLUR_PX).toFixed(2)}px)` : "none";
      }
    },
  };
}
