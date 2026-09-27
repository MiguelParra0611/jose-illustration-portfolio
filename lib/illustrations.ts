export interface Illustration {
  slug: string;
  title: string;
  /** Short tag shown under the title, e.g. "Splash art". */
  discipline: string;
  description: string;
  /** Path under public/illustrations/, or null while the real artwork hasn't landed yet. */
  image: string | null;
  /** Path to a video under public/illustrations/, if this piece has one. */
  speedDrawing?: string;
}

/**
 * PLACEHOLDER data for checkpoint 3 (gallery shell). Replace with José's five
 * real pieces, titles and descriptions in checkpoint 5 — see
 * docs/intent/portfolio.md. Card.tsx renders a stand-in visual whenever
 * `image` is null, so this shape can go live untouched once real images and
 * copy are dropped in.
 */
export const ILLUSTRATIONS: Illustration[] = [
  {
    slug: "character-concept",
    title: "Character concept",
    discipline: "Character design",
    description: "Placeholder — replaced with the real piece and its story in checkpoint 5.",
    image: null,
  },
  {
    slug: "splash-art",
    title: "Splash art",
    discipline: "Splash art",
    description: "Placeholder — replaced with the real piece and its story in checkpoint 5.",
    image: null,
  },
  {
    slug: "environment-key",
    title: "Environment key",
    discipline: "Environment",
    description: "Placeholder — replaced with the real piece and its story in checkpoint 5.",
    image: null,
  },
  {
    slug: "creature-design",
    title: "Creature design",
    discipline: "Creature design",
    description: "Placeholder — replaced with the real piece and its story in checkpoint 5.",
    image: null,
  },
  {
    slug: "key-visual",
    title: "Key visual",
    discipline: "Illustration",
    description: "Placeholder — replaced with the real piece and its story in checkpoint 5.",
    image: null,
  },
];
