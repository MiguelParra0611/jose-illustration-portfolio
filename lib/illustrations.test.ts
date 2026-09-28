import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { ILLUSTRATIONS, isLandscape } from "./illustrations";

const PUBLIC = path.resolve(import.meta.dirname, "..", "public");
const onDisk = (webPath: string) => path.join(PUBLIC, webPath);

describe("ILLUSTRATIONS", () => {
  it("has the five pieces, each with unique slugs and real copy", () => {
    expect(ILLUSTRATIONS).toHaveLength(5);
    expect(new Set(ILLUSTRATIONS.map((i) => i.slug)).size).toBe(ILLUSTRATIONS.length);

    for (const illustration of ILLUSTRATIONS) {
      expect(illustration.title.trim()).not.toBe("");
      expect(illustration.description.trim()).not.toBe("");
      expect(illustration.discipline.trim()).not.toBe("");
    }
  });

  it("points every piece at images that exist, with alt text", () => {
    for (const { image, slug } of ILLUSTRATIONS) {
      expect(image, `${slug} has no image`).not.toBeNull();
      expect(existsSync(onDisk(image!.card)), `${slug} card image is missing`).toBe(true);
      expect(existsSync(onDisk(image!.full)), `${slug} full image is missing`).toBe(true);
      expect(image!.alt.trim(), `${slug} needs alt text`).not.toBe("");
    }
  });

  it("records the pixel size of the files it points to (guards against stale generated data)", async () => {
    for (const { image, slug } of ILLUSTRATIONS) {
      const full = await sharp(onDisk(image!.full)).metadata();
      const card = await sharp(onDisk(image!.card)).metadata();

      expect([full.width, full.height], `${slug}: run npm run optimize:illustrations`).toEqual([
        image!.width,
        image!.height,
      ]);
      // The card is a downscale of the same picture, so the aspect ratio must match.
      expect(card.width! / card.height!).toBeCloseTo(full.width! / full.height!, 2);
    }
  });

  it("fills the grid without holes at 2 and 3 columns", () => {
    // Mirrors Card.tsx: a portrait takes one column, a landscape piece two (from `sm`).
    const spans = ILLUSTRATIONS.map(({ image }) => (image && isLandscape(image) ? 2 : 1));

    for (const columns of [2, 3]) {
      let filled = 0;
      let holes = 0;

      for (const span of spans) {
        if (filled + span > columns) {
          holes += columns - filled; // the item wraps, leaving the rest of the row empty
          filled = 0;
        }
        filled = (filled + span) % columns;
      }

      expect(holes, `${columns}-column grid would have gaps; reorder the pieces`).toBe(0);
    }
  });
});
