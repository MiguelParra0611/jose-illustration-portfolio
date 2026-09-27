import type { TimelineConfig } from "./timeline";

export interface HeroFrameConfig {
  src: string;
  /**
   * Where the subject sits in the frame (0..1). The camera keeps this point
   * centred when the frame is cropped (portrait phones) or zoomed.
   */
  focal: { x: number; y: number };
}

/**
 * The hero is driven entirely by this list. To swap the AI-generated frames
 * for ones José draws himself, replace the files and adjust `focal`; add or
 * remove entries and the scroll range re-divides itself.
 */
export const HERO_FRAMES: HeroFrameConfig[] = [
  // 1. Far away in the street.
  { src: "/hero/frame1.webp", focal: { x: 0.496, y: 0.56 } },
  // 2. Closer.
  { src: "/hero/frame2.webp", focal: { x: 0.47, y: 0.42 } },
  // 3. Extreme close-up of the mask.
  { src: "/hero/frame3.webp", focal: { x: 0.5, y: 0.38 } },
  // 4. Full body, low angle.
  { src: "/hero/frame4.webp", focal: { x: 0.476, y: 0.42 } },
];

/** Length of the pinned scroll, in small-viewport heights (svh). */
export const HERO_SCROLL_SVH = 500;

/** Seconds the drawn progress takes to catch up with the real scroll. Higher feels heavier. */
export const HERO_SMOOTHING_SECONDS = 0.08;

/** Extra zoom applied to every frame so shake and pushes never reveal an edge. */
export const HERO_OVERSCAN = 1.05;

/** Blur radius (in source pixels) of the pre-blurred copy of each frame. */
export const HERO_BLUR_RADIUS = 10;

export const HERO_TIMELINE: TimelineConfig = {
  frameCount: HERO_FRAMES.length,
  hold: 0.45,
  push: 0.06,
  shake: 0.0035,
  transitions: [
    // 1 -> 2 and 2 -> 3: the camera pushes in toward the mask.
    { zoomOut: 1.55, zoomIn: 1.3 },
    { zoomOut: 1.6, zoomIn: 1.3 },
    // 3 -> 4: whip out of the close-up and pull back to reveal the full figure.
    { zoomOut: 1.3, zoomIn: 1.7 },
  ],
};
