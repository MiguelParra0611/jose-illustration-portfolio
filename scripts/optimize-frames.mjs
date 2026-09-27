// Converts the hero keyframes in assets-source/ to WebP in public/hero/.
// Run with: npm run optimize:frames
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-source";
const OUT = "public/hero";
const FRAME_COUNT = 4;

/**
 * Frame 1 only: blurs the character's face so no one's identity or likeness
 * reads from the AI-generated image. Coordinates are pixels in frame1.jpg's
 * native 1376x768, measured by hand with a pixel grid overlaid on the source
 * (see git history of this file for the measuring script). If frame1 is ever
 * replaced, delete this block — a new image needs its own region, or none.
 */
const FACE_BLUR = {
  frame: 1,
  region: { cx: 685, cy: 383, rx: 24, ry: 23 },
  sigma: 10,
};

async function withFaceBlur(input, { region, sigma }) {
  const { width, height } = await sharp(input).metadata();

  const blurred = await sharp(input).blur(sigma).toBuffer();

  // A radial-gradient ellipse mask feathers the edge so the blurred patch
  // blends into the sharp image instead of showing a hard-edged circle.
  const mask = await sharp(
    Buffer.from(
      `<svg width="${width}" height="${height}">` +
        '<defs><radialGradient id="g" cx="50%" cy="50%" r="50%">' +
        '<stop offset="40%" stop-color="white" stop-opacity="1"/>' +
        '<stop offset="100%" stop-color="white" stop-opacity="0"/>' +
        "</radialGradient></defs>" +
        `<ellipse cx="${region.cx}" cy="${region.cy}" rx="${region.rx}" ry="${region.ry}" fill="url(#g)"/>` +
        "</svg>",
    ),
  )
    .png()
    .toBuffer();

  const blurredFace = await sharp(blurred)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(input).composite([{ input: blurredFace }]);
}

await mkdir(OUT, { recursive: true });

let before = 0;
let after = 0;

for (let n = 1; n <= FRAME_COUNT; n++) {
  const input = path.join(SRC, `frame${n}.jpg`);
  const output = path.join(OUT, `frame${n}.webp`);

  const pipeline =
    n === FACE_BLUR.frame ? await withFaceBlur(input, FACE_BLUR) : sharp(input);

  const info = await pipeline.webp({ quality: 84, effort: 6 }).toFile(output);
  const original = (await stat(input)).size;

  before += original;
  after += info.size;
  console.log(
    `frame${n}: ${info.width}x${info.height}  ${(original / 1024).toFixed(0)} KB -> ${(info.size / 1024).toFixed(0)} KB${n === FACE_BLUR.frame ? "  (face blurred)" : ""}`,
  );
}

console.log(`total: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
