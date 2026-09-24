// Converts the hero keyframes in assets-source/ to WebP in public/hero/.
// Run with: npm run optimize:frames
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-source";
const OUT = "public/hero";
const FRAME_COUNT = 4;

await mkdir(OUT, { recursive: true });

let before = 0;
let after = 0;

for (let n = 1; n <= FRAME_COUNT; n++) {
  const input = path.join(SRC, `frame${n}.jpg`);
  const output = path.join(OUT, `frame${n}.webp`);

  const info = await sharp(input).webp({ quality: 84, effort: 6 }).toFile(output);
  const original = (await stat(input)).size;

  before += original;
  after += info.size;
  console.log(
    `frame${n}: ${info.width}x${info.height}  ${(original / 1024).toFixed(0)} KB -> ${(info.size / 1024).toFixed(0)} KB`,
  );
}

console.log(`total: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
