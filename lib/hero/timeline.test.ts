import { describe, expect, it } from "vitest";
import {
  computeHeroState,
  dominantFrame,
  frameTextPhase,
  smoothstep,
  type TimelineConfig,
} from "./timeline";

const config: TimelineConfig = {
  frameCount: 4,
  hold: 0.4,
  push: 0,
  shake: 0,
  transitions: [{ zoomOut: 1.5, zoomIn: 1.3 }],
};

/** Scale of whichever layer is fully visible at this progress. */
function visibleScale(progress: number, cfg: TimelineConfig = config): number {
  const state = computeHeroState(progress, cfg);
  return state.top && state.top.alpha >= 0.999 ? state.top.scale : state.base.scale;
}

describe("computeHeroState", () => {
  it("starts on the first frame, untouched", () => {
    const state = computeHeroState(0, config);

    expect(state.top).toBeNull();
    expect(state.base).toEqual({ index: 0, alpha: 1, scale: 1, blur: 0 });
  });

  it("ends on the last frame, sharp and at rest", () => {
    const state = computeHeroState(1, config);

    expect(state.top).toEqual({ index: 3, alpha: 1, scale: 1, blur: 0 });
    expect(dominantFrame(state)).toBe(3);
  });

  it("clamps progress outside 0..1", () => {
    expect(computeHeroState(-5, config)).toEqual(computeHeroState(0, config));
    expect(computeHeroState(7, config)).toEqual(computeHeroState(1, config));
  });

  it("holds each station still on both sides of it", () => {
    // Stations sit at 0, 1/3, 2/3, 1 for four frames.
    for (const [station, frame] of [
      [1 / 3, 1],
      [2 / 3, 2],
    ] as const) {
      for (const offset of [-0.02, 0, 0.02]) {
        const state = computeHeroState(station + offset, config);

        expect(dominantFrame(state)).toBe(frame);
        expect(visibleScale(station + offset)).toBeCloseTo(1, 10);
      }
    }
  });

  it("is continuous across a station boundary", () => {
    const before = computeHeroState(1 / 3 - 1e-9, config);
    const after = computeHeroState(1 / 3 + 1e-9, config);

    expect(dominantFrame(before)).toBe(dominantFrame(after));
    expect(visibleScale(1 / 3 - 1e-9)).toBeCloseTo(visibleScale(1 / 3 + 1e-9), 6);
  });

  it("brings the incoming frame in monotonically while the outgoing one pushes in", () => {
    let previousAlpha = 0;
    let previousScale = 1;

    // Stop short of p = 1/3: that instant already belongs to the next segment.
    for (let i = 0; i < 200; i++) {
      const state = computeHeroState((i / 200) * (1 / 3), config);
      const alpha = state.top?.alpha ?? 0;

      expect(alpha).toBeGreaterThanOrEqual(previousAlpha - 1e-12);
      expect(state.base.scale).toBeGreaterThanOrEqual(previousScale - 1e-12);

      previousAlpha = alpha;
      previousScale = state.base.scale;
    }
  });

  it("blurs both frames mid-transition and keeps them sharp at the ends", () => {
    // Middle of the first transition: segment 0, u = 0.5.
    const mid = computeHeroState(0.5 / 3, config);

    expect(mid.t).toBeCloseTo(0.5, 6);
    expect(mid.base.blur).toBeGreaterThan(0.5);
    expect(mid.top?.blur ?? 0).toBeGreaterThan(0.5);

    expect(computeHeroState(0, config).base.blur).toBe(0);
    expect(computeHeroState(1 / 3, config).top?.blur ?? 0).toBeCloseTo(0, 10);
  });

  it("uses the parameters of the matching transition, reusing the last one when short", () => {
    const cfg: TimelineConfig = {
      ...config,
      hold: 0,
      transitions: [
        { zoomOut: 2, zoomIn: 1.1 },
        { zoomOut: 1.2, zoomIn: 1.9 },
      ],
    };

    // Just before the end of segment 0 the outgoing frame has almost reached zoomOut = 2.
    expect(computeHeroState(1 / 3 - 1e-6, cfg).base.scale).toBeCloseTo(2, 3);
    // Segment 2 has no entry of its own, so it reuses the second one.
    expect(computeHeroState(1 - 1e-6, cfg).base.scale).toBeCloseTo(1.2, 3);
  });

  it("adds a uniform slow push over the whole scroll", () => {
    const cfg: TimelineConfig = { ...config, push: 0.1 };

    expect(visibleScale(0, cfg)).toBeCloseTo(1, 10);
    expect(visibleScale(1, cfg)).toBeCloseTo(1.1, 10);
  });

  it("supports a single frame", () => {
    const state = computeHeroState(0.6, { ...config, frameCount: 1 });

    expect(state.top).toBeNull();
    expect(state.base.index).toBe(0);
  });

  it("keeps camera shake within its amplitude", () => {
    const cfg: TimelineConfig = { ...config, shake: 0.01 };

    for (let i = 0; i <= 500; i++) {
      const { x, y } = computeHeroState(i / 500, cfg).shake;

      expect(Math.abs(x)).toBeLessThanOrEqual(0.015 + 1e-12);
      expect(Math.abs(y)).toBeLessThanOrEqual(0.015 + 1e-12);
    }
    expect(computeHeroState(0.3, config).shake).toEqual({ x: 0, y: 0 });
  });
});

describe("smoothstep", () => {
  it("is 0 below, 1 above and 0.5 at the middle", () => {
    expect(smoothstep(0.2, 0.8, 0)).toBe(0);
    expect(smoothstep(0.2, 0.8, 1)).toBe(1);
    expect(smoothstep(0.2, 0.8, 0.5)).toBeCloseTo(0.5, 10);
  });
});

describe("frameTextPhase", () => {
  const opacities = (progress: number) =>
    [0, 1, 2, 3].map((i) => frameTextPhase(computeHeroState(progress, config), i).opacity);

  it("shows only the first frame's copy at the start and only the last frame's at the end", () => {
    expect(opacities(0)).toEqual([1, 0, 0, 0]);
    expect(opacities(1)).toEqual([0, 0, 0, 1]);
  });

  it("shows only the copy of the frame holding still at each station", () => {
    expect(opacities(1 / 3)).toEqual([0, 1, 0, 0]);
    expect(opacities(2 / 3)).toEqual([0, 0, 1, 0]);
    expect(opacities(1 / 3 - 0.02)).toEqual([0, 1, 0, 0]);
    expect(opacities(1 / 3 + 0.02)).toEqual([0, 1, 0, 0]);
  });

  it("leaves a gap mid-transition instead of stacking two frames' copy", () => {
    expect(opacities(0.5 / 3)).toEqual([0, 0, 0, 0]);

    for (let i = 0; i <= 300; i++) {
      const total = opacities(i / 300).reduce((a, b) => a + b, 0);
      expect(total).toBeLessThanOrEqual(1 + 1e-9);
    }
  });

  it("fades the outgoing copy out and the incoming copy in, monotonically", () => {
    let outgoing = 1;
    let incoming = 0;

    for (let i = 0; i < 200; i++) {
      const state = computeHeroState((i / 200) * (1 / 3), config);
      const out = frameTextPhase(state, 0).opacity;
      const inn = frameTextPhase(state, 1).opacity;

      expect(out).toBeLessThanOrEqual(outgoing + 1e-12);
      expect(inn).toBeGreaterThanOrEqual(incoming - 1e-12);

      outgoing = out;
      incoming = inn;
    }
  });

  it("drifts past copy up and upcoming copy from below", () => {
    const state = computeHeroState(2 / 3, config);

    expect(frameTextPhase(state, 0).offset).toBe(-1);
    expect(frameTextPhase(state, 2).offset).toBe(0);
    expect(frameTextPhase(state, 3).offset).toBe(1);
  });
});
