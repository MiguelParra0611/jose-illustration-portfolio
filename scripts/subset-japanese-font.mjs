// Builds a tiny Shippori Mincho font holding only the Japanese glyphs used in lib/hero/copy.ts.
// Run with: npm run subset:font   (needs network; the font is OFL-licensed, so self-hosting is fine)
import { mkdir, readFile, writeFile } from "node:fs/promises";

const COPY_FILE = "lib/hero/copy.ts";
const OUT_FILE = "app/fonts/shippori-mincho-subset.woff2";
const FAMILY = "Shippori Mincho";
const WEIGHT = 700;

// Hiragana, katakana, CJK ideographs and CJK punctuation.
const JAPANESE = /[　-ヿ㐀-䶿一-鿿＀-￯]/g;

const source = await readFile(COPY_FILE, "utf8");
const glyphs = [...new Set(source.match(JAPANESE) ?? [])].sort().join("");

if (!glyphs) {
  throw new Error(`No Japanese characters found in ${COPY_FILE}`);
}
console.log(`glyphs (${[...glyphs].length}): ${glyphs}`);

// A modern browser user agent makes Google Fonts answer with woff2.
const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
};

const cssUrl = `https://fonts.googleapis.com/css2?family=${FAMILY.replaceAll(" ", "+")}:wght@${WEIGHT}&display=swap&text=${encodeURIComponent(glyphs)}`;
const css = await (await fetch(cssUrl, { headers })).text();
const fontUrl = css.match(/url\((https:[^)]+)\)\s*format\('woff2'\)/)?.[1];

if (!fontUrl) {
  throw new Error(`Google Fonts did not return a woff2 URL:\n${css}`);
}

const font = Buffer.from(await (await fetch(fontUrl, { headers })).arrayBuffer());
await mkdir("app/fonts", { recursive: true });
await writeFile(OUT_FILE, font);
console.log(`wrote ${OUT_FILE} (${font.length} bytes)`);
