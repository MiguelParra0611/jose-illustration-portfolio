import type { HeroFrameConfig } from "./config";
import type { HeroState, LayerState } from "./timeline";

type Drawable = ImageBitmap | HTMLImageElement | HTMLCanvasElement;

export interface HeroFrameAsset {
  sharp: Drawable;
  /** Same size as `sharp`, pre-blurred so blurring costs nothing per frame. */
  blurred: Drawable;
  width: number;
  height: number;
  focal: { x: number; y: number };
}

export interface HeroRenderer {
  /** Re-reads the canvas size (CSS px * device pixel ratio) and redraws. */
  resize(): void;
  render(state: HeroState): void;
  destroy(): void;
}

export interface HeroRendererOptions {
  overscan: number;
  /** Cap on the device pixel ratio, to keep phones and 4K screens affordable. */
  maxDpr: number;
}

const DEFAULT_OPTIONS: HeroRendererOptions = { overscan: 1.05, maxDpr: 2 };

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

async function loadDrawable(src: string): Promise<{ image: Drawable; width: number; height: number }> {
  if (typeof createImageBitmap === "function") {
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bitmap = await createImageBitmap(await response.blob());
      return { image: bitmap, width: bitmap.width, height: bitmap.height };
    } catch {
      // Fall through to a plain <img>.
    }
  }

  const img = new Image();
  img.src = src;
  await img.decode();
  return { image: img, width: img.naturalWidth, height: img.naturalHeight };
}

function supportsCanvasFilter(): boolean {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return false;
  ctx.filter = "blur(1px)";
  return ctx.filter === "blur(1px)";
}

function createBlurred(image: Drawable, width: number, height: number, radius: number, useFilter: boolean): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.imageSmoothingQuality = "high";

  if (useFilter) {
    // Draw oversized so the transparent fringe the blur creates falls outside the canvas.
    const pad = radius * 3;
    ctx.filter = `blur(${radius}px)`;
    ctx.drawImage(image, -pad, -pad, width + pad * 2, height + pad * 2);
    ctx.filter = "none";
    return canvas;
  }

  // Safari has no canvas filter: shrink hard, then stretch back with smoothing.
  const factor = Math.max(4, Math.round(radius * 0.9));
  const small = document.createElement("canvas");
  small.width = Math.max(8, Math.round(width / factor));
  small.height = Math.max(8, Math.round(height / factor));
  const smallCtx = small.getContext("2d");
  if (smallCtx) {
    smallCtx.imageSmoothingQuality = "high";
    smallCtx.drawImage(image, 0, 0, small.width, small.height);
    ctx.drawImage(small, 0, 0, width, height);
  }
  return canvas;
}

export async function loadHeroAssets(
  frames: HeroFrameConfig[],
  blurRadius: number,
  onProgress?: (loaded: number, total: number) => void,
): Promise<HeroFrameAsset[]> {
  let loaded = 0;

  const drawables = await Promise.all(
    frames.map(async (frame) => {
      const result = await loadDrawable(frame.src);
      onProgress?.(++loaded, frames.length);
      return result;
    }),
  );

  const useFilter = supportsCanvasFilter();

  return drawables.map(({ image, width, height }, i) => ({
    sharp: image,
    blurred: createBlurred(image, width, height, blurRadius, useFilter),
    width,
    height,
    focal: frames[i].focal,
  }));
}

export function createHeroRenderer(
  canvas: HTMLCanvasElement,
  assets: HeroFrameAsset[],
  options: Partial<HeroRendererOptions> = {},
): HeroRenderer {
  const { overscan, maxDpr } = { ...DEFAULT_OPTIONS, ...options };

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas is not available");

  // The incoming frame is composed here first so its blur mix stays exact
  // before it is faded over the outgoing frame.
  const scratch = document.createElement("canvas");
  const scratchCtx = scratch.getContext("2d");
  if (!scratchCtx) throw new Error("2D canvas is not available");

  let width = 0;
  let height = 0;
  let lastState: HeroState | null = null;

  function drawLayer(
    target: CanvasRenderingContext2D,
    layer: LayerState,
    shake: { x: number; y: number },
  ): void {
    const asset = assets[layer.index];
    if (!asset) return;

    const cover = Math.max(width / asset.width, height / asset.height);
    const zoom = layer.scale * overscan;
    const drawWidth = asset.width * cover * zoom;
    const drawHeight = asset.height * cover * zoom;

    // Keep the subject centred, add shake, then stop short of showing an edge.
    const x = clamp(width / 2 - asset.focal.x * drawWidth + shake.x * width, width - drawWidth, 0);
    const y = clamp(height / 2 - asset.focal.y * drawHeight + shake.y * width, height - drawHeight, 0);

    target.globalAlpha = 1;
    target.drawImage(asset.sharp, x, y, drawWidth, drawHeight);

    if (layer.blur > 0.01) {
      target.globalAlpha = layer.blur;
      target.drawImage(asset.blurred, x, y, drawWidth, drawHeight);
      target.globalAlpha = 1;
    }
  }

  function render(state: HeroState): void {
    lastState = state;
    if (width === 0 || height === 0) return;

    const { base, top, shake } = state;
    const topAlpha = top?.alpha ?? 0;

    if (top && topAlpha >= 0.999) {
      drawLayer(ctx!, top, shake);
      return;
    }

    drawLayer(ctx!, base, shake);

    if (top && topAlpha > 0.001) {
      scratchCtx!.globalAlpha = 1;
      drawLayer(scratchCtx!, top, shake);

      ctx!.globalAlpha = topAlpha;
      ctx!.drawImage(scratch, 0, 0);
      ctx!.globalAlpha = 1;
    }
  }

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const nextWidth = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const nextHeight = Math.max(1, Math.round(canvas.clientHeight * dpr));

    if (nextWidth === width && nextHeight === height) return;

    width = nextWidth;
    height = nextHeight;
    canvas.width = width;
    canvas.height = height;
    scratch.width = width;
    scratch.height = height;

    // Resizing clears the canvas and resets its state.
    ctx!.imageSmoothingQuality = "high";
    scratchCtx!.imageSmoothingQuality = "high";

    if (lastState) render(lastState);
  }

  resize();

  return {
    resize,
    render,
    destroy() {
      lastState = null;
      releaseHeroAssets(assets);
    },
  };
}

/** Frees the decoded bitmaps. Call it for assets that were loaded but never handed to a renderer. */
export function releaseHeroAssets(assets: HeroFrameAsset[]): void {
  for (const asset of assets) {
    if ("close" in asset.sharp) asset.sharp.close();
  }
}
