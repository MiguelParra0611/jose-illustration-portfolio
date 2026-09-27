/**
 * Pure maths for the scroll-driven hero. No DOM, no canvas: scroll progress
 * (0..1) goes in, a description of what to draw comes out.
 *
 * The scroll range is split into `frameCount - 1` equal segments, one per
 * transition. Inside a segment the frame first holds still, then the
 * transition plays (the outgoing frame pushes in and blurs while the incoming
 * frame arrives zoomed in and settles), then it holds again.
 */

export interface TransitionParams {
  /** Scale the outgoing frame reaches at the end of the transition (camera pushes in). */
  zoomOut: number;
  /** Scale the incoming frame starts from before it settles to 1. */
  zoomIn: number;
}

export interface TimelineConfig {
  frameCount: number;
  /** Fraction of each segment kept still, split evenly before and after the transition (0..0.9). */
  hold: number;
  /** Extra uniform zoom accumulated over the whole scroll (a slow dolly). */
  push: number;
  /** Handheld camera shake, as a fraction of the canvas width. */
  shake: number;
  /** One entry per segment. The last entry is reused if the list is shorter. */
  transitions: TransitionParams[];
}

export interface LayerState {
  /** Index into the frame list. */
  index: number;
  /** 0..1 opacity when composited over the layer below. */
  alpha: number;
  /** Zoom factor relative to a cover-fit of the frame. */
  scale: number;
  /** 0..1 mix of the pre-blurred variant over the sharp frame. */
  blur: number;
}

export interface HeroState {
  progress: number;
  /** Which frame-to-frame segment we are in. */
  segment: number;
  /** 0..1 progress of the transition inside the segment (0 while holding on the outgoing frame). */
  t: number;
  /** Always opaque; the outgoing frame. */
  base: LayerState;
  /** The incoming frame, or null when it isn't visible yet. */
  top: LayerState | null;
  /** Camera shake offset, as a fraction of the canvas width. */
  shake: { x: number; y: number };
}

const DEFAULT_TRANSITION: TransitionParams = { zoomOut: 1.5, zoomIn: 1.3 };

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

const easeInQuad = (t: number): number => t * t;
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

function cameraShake(progress: number, t: number, amount: number): { x: number; y: number } {
  if (amount <= 0) return { x: 0, y: 0 };

  // Barely there while holding, strongest mid-transition.
  const envelope = 0.2 + 0.8 * Math.sin(Math.PI * t) ** 2;
  const a = amount * envelope;
  const tau = 2 * Math.PI;

  return {
    x: a * (Math.sin(progress * tau * 23) + 0.5 * Math.sin(progress * tau * 57 + 1.3)),
    y: a * (Math.sin(progress * tau * 31 + 0.7) + 0.5 * Math.sin(progress * tau * 71 + 2.1)),
  };
}

export function computeHeroState(progress: number, config: TimelineConfig): HeroState {
  const p = clamp01(progress);
  const frameCount = Math.max(1, Math.floor(config.frameCount));
  const push = 1 + config.push * p;

  if (frameCount === 1) {
    return {
      progress: p,
      segment: 0,
      t: 0,
      base: { index: 0, alpha: 1, scale: push, blur: 0 },
      top: null,
      shake: cameraShake(p, 0, config.shake),
    };
  }

  const segments = frameCount - 1;
  const position = p * segments;
  const segment = Math.min(Math.floor(position), segments - 1);
  const u = position - segment; // 0..1 inside the segment (1 exactly at p = 1)

  const hold = Math.min(0.9, Math.max(0, config.hold));
  const t = clamp01((u - hold / 2) / (1 - hold));

  const params =
    config.transitions[Math.min(segment, config.transitions.length - 1)] ?? DEFAULT_TRANSITION;

  const base: LayerState = {
    index: segment,
    alpha: 1,
    scale: push * (1 + (params.zoomOut - 1) * easeInQuad(t)),
    blur: smoothstep(0, 0.55, t),
  };

  const top: LayerState | null =
    t > 0
      ? {
          index: segment + 1,
          alpha: smoothstep(0.25, 0.75, t),
          scale: push * (1 + (params.zoomIn - 1) * (1 - easeOutCubic(t))),
          blur: 1 - smoothstep(0.45, 1, t),
        }
      : null;

  return { progress: p, segment, t, base, top, shake: cameraShake(p, t, config.shake) };
}

/** Index of the frame that is fully on screen (the incoming one once it fully covers the outgoing one). */
export function dominantFrame(state: HeroState): number {
  return state.top && state.top.alpha >= 0.999 ? state.top.index : state.base.index;
}

export interface TextPhase {
  /** 0..1 opacity of the text that belongs to a frame. */
  opacity: number;
  /** -1 (already gone, drifted up) .. 0 (fully shown) .. 1 (still waiting, below). */
  offset: number;
}

/**
 * How visible the copy of one frame is. Text leaves early in a transition and
 * arrives late, so two frames' copy is never on screen at the same time.
 */
export function frameTextPhase(state: HeroState, frameIndex: number): TextPhase {
  const { segment, t } = state;

  if (frameIndex === segment) {
    const gone = smoothstep(0, 0.35, t);
    return { opacity: 1 - gone, offset: 0 - gone };
  }

  if (frameIndex === segment + 1) {
    const away = 1 - smoothstep(0.65, 1, t);
    return { opacity: 1 - away, offset: away };
  }

  return { opacity: 0, offset: frameIndex < segment ? -1 : 1 };
}
