export interface Illustration {
  slug: string;
  title: string;
  /** Short tag shown under the title, e.g. "Splash art". */
  discipline: string;
  year: number;
  tools: string[];
  description: string;
  /** Path under public/illustrations/, or null while the real artwork hasn't landed yet. */
  image: string | null;
  /**
   * A YouTube URL (recommended for anything long/heavy — see
   * lib/speed-drawing.ts) or a local path under public/illustrations/ for a
   * short, light clip. Omitted while there's no real recording yet.
   */
  speedDrawing?: string;
}

/**
 * PLACEHOLDER data for checkpoint 3/4 (gallery shell + detail view). Replace
 * with José's five real pieces, titles, descriptions and speed drawings in
 * checkpoint 5 — see docs/intent/portfolio.md. Card.tsx and DetailDialog.tsx
 * render a stand-in visual whenever `image` is null, so this shape can go
 * live untouched once real images and copy are dropped in.
 */
export const ILLUSTRATIONS: Illustration[] = [
  {
    slug: "character-concept",
    title: "Character concept",
    discipline: "Character design",
    year: 2026,
    tools: ["Photoshop", "Procreate"],
    description: "Placeholder — replaced with the real piece and its story in checkpoint 5.",
    image: null,
  },
  {
    slug: "splash-art",
    title: "Splash art",
    discipline: "Splash art",
    year: 2026,
    tools: ["Photoshop"],
    description: "Placeholder — replaced with the real piece and its story in checkpoint 5.",
    image: null,
  },
  {
    slug: "environment-key",
    title: "Environment key",
    discipline: "Environment",
    year: 2026,
    tools: ["Photoshop", "Blender"],
    description: "Placeholder — replaced with the real piece and its story in checkpoint 5.",
    image: null,
  },
  {
    slug: "creature-design",
    title: "Creature design",
    discipline: "Creature design",
    year: 2026,
    tools: ["Procreate"],
    description: "Placeholder — replaced with the real piece and its story in checkpoint 5.",
    image: null,
  },
  {
    slug: "key-visual",
    title: "Key visual",
    discipline: "Illustration",
    year: 2026,
    tools: ["Photoshop", "Procreate"],
    description: "Placeholder — replaced with the real piece and its story in checkpoint 5.",
    image: null,
  },
];
