import { smoothstep } from "./timeline";

/**
 * Scroll progress at which the light-section curtain starts rising. Chosen
 * to sit inside frame 4's final hold (see HERO_TIMELINE.hold in config.ts),
 * so it never competes with the frame 3->4 pull-back transition.
 */
export const CURTAIN_START = 0.9;

/**
 * 0..1 amount the curtain has risen, reaching 1 right as the pin releases.
 * Drives both the curtain's own reveal and the hero overlay's fade-out (see
 * ScrollHero.tsx), so the light section never shows the hero's white text
 * over a light background.
 */
export function curtainAmount(progress: number): number {
  return smoothstep(CURTAIN_START, 1, progress);
}
