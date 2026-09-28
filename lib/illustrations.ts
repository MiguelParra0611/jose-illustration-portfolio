import { ILLUSTRATION_IMAGES } from "./illustration-images";

export interface IllustrationImage {
  /** Light version for the grid card (public/illustrations/<slug>-card.webp). */
  card: string;
  /** Large version for the detail view (public/illustrations/<slug>.webp). */
  full: string;
  /** Pixel size of `full`; `card` shares its aspect ratio. Generated, see lib/illustration-images.ts. */
  width: number;
  height: number;
  /** Describes the artwork for screen readers (shown on the detail view; the card is named by its title). */
  alt: string;
  /** CSS object-position: what a cropped card should keep in frame. Defaults to the centre. */
  focus?: string;
}

export interface Illustration {
  slug: string;
  title: string;
  /** Short tag shown above the title, e.g. "Splash art". */
  discipline: string;
  /** One entry per paragraph, shown in order on the detail view. */
  description: string[];
  /** Left out (rather than guessed) until José confirms them. */
  year?: number;
  tools?: string[];
  /** Null renders a stand-in visual, handy while a piece has no artwork yet. */
  image: IllustrationImage | null;
  /**
   * A YouTube URL (recommended for anything long/heavy — see
   * lib/speed-drawing.ts) or a local path under public/illustrations/ for a
   * short, light clip. Omitted while there's no real recording yet.
   */
  speedDrawing?: string;
}

export const isLandscape = (image: IllustrationImage): boolean => image.width > image.height;

/**
 * José's five pieces. Order matters for the grid: a landscape piece spans two
 * of the three desktop columns (see Card.tsx), so it goes first and the rows
 * fill exactly (2+1, then 1+1+1) with no gaps at any breakpoint.
 *
 * Pixel facts come from the generated ILLUSTRATION_IMAGES; the words here are
 * written by hand. Aurora and Wild Devotion carry José's own wording, and
 * Poki opens with his note that it is part of a "Queen" series inspired by his
 * wife. Everything else in Poki, and all of Whitebird and Sacred, was drafted
 * from what is visible in the artwork, so replace it when he sends his own.
 * The titles of those last two come from the original file names. Add `year` /
 * `tools` / `speedDrawing` when he has them.
 */
export const ILLUSTRATIONS: Illustration[] = [
  {
    slug: "aurora",
    title: "Aurora",
    discipline: "Splash art · Fan art",
    description: [
      "An original splash art exploring character, atmosphere, and narrative through light. Set within a dimly lit tavern, the piece captures a fleeting moment between celebration and the supernatural, contrasting warm ambient lighting with vibrant magical energy.",
      "Created as an original fan art inspired by the visual language of Riot Games' League of Legends, the piece was also an exercise in composition, character rendering, lighting, and environmental storytelling. Rather than relying on extensive pre-production, the artwork developed organically through the painting process, allowing the composition and lighting to evolve alongside the character.",
    ],
    image: {
      ...ILLUSTRATION_IMAGES.aurora,
      alt: "Splash art of a red-haired sorceress in a feathered teal hat, reclining in a candle-lit tavern and casting blue magic with her wand.",
      focus: "50% 35%",
    },
  },
  {
    slug: "tigre",
    title: "Wild Devotion",
    discipline: "Illustration",
    description: [
      "A study in scale, contrast and quiet connection. The imposing presence of the tiger is balanced by the restrained posture of the figure, transforming what could feel threatening into something intimate.",
      "Saturated oranges and reds dominate the composition, contrasted against muted stone and shadow. Strong graphic contours define the animal while softer painterly textures shape the character, fabric and environment, creating a balance between illustration and painterly rendering.",
    ],
    image: {
      ...ILLUSTRATION_IMAGES.tigre,
      alt: "Illustration of a giant tiger resting its head in the hand of a girl in red ceremonial robes, with a red torii gate behind them.",
    },
  },
  {
    slug: "poki",
    title: "Poki",
    discipline: "Portrait",
    description: [
      "The second part of a “Queen” series inspired by the artist's wife. A young woman glances out with a calm, knowing smile while two cockatiels settle on her shoulder and hand, turning a simple bust into a small moment of trust between character and companions.",
      "Warm skin tones and coral shadows sit against cool blues and silvers: the face paint, the blue nails and the silver feather and laurel ornaments, which read as a quiet, understated crown, echo one another across the composition. Soft, blended edges shape the face and hair, while the birds' plumage adds more defined passages against the pale background.",
    ],
    image: {
      ...ILLUSTRATION_IMAGES.poki,
      alt: "Portrait of a young woman with wavy brown hair, silver feather ornaments and blue face paint, with two cockatiels perched on her shoulder and hand.",
    },
  },
  {
    slug: "whitebird",
    title: "Whitebird",
    discipline: "Portrait",
    description: [
      "A study in contrast between sight and its absence. A blindfold covers the character's eyes while a gold collar set with open eyes watches in their place, and small white wings sweep through her pink hair, lending an otherworldly presence to an otherwise quiet pose.",
      "A pale palette of soft pinks, whites and cool grey-blues is anchored by three accents: the dark blindfold, the warm gold of the collar and the red of the lips. Soft, directional light sculpts the face and neck in gentle shadow, while the feathers and hair are handled with loose, painterly strokes.",
    ],
    image: {
      ...ILLUSTRATION_IMAGES.whitebird,
      alt: "Portrait of a blindfolded girl with pale pink hair, white wings in her hair and a gold collar set with eyes.",
    },
  },
  {
    slug: "sacred",
    title: "Sacred",
    discipline: "Character design",
    description: [
      "A character design that turns sacred imagery into something ominous. A veiled figure in black robes wears a spiked halo hung with stars, the face lit by a narrow beam under the hood, while clawed gloves grip a crimson-wrapped staff.",
      "The palette is almost entirely black and charcoal, broken only by the crimson of the veil lining, the staff and the jewels, and by the pale ruffled cuffs. Fine damask patterns and the silver filigree of the staff add texture to the dark mass, while the glossy gloves and metallic halo contrast with the softer, painterly cloth.",
    ],
    image: {
      ...ILLUSTRATION_IMAGES.sacred,
      alt: "Character design of a veiled figure in black robes and a spiked halo, holding a crimson-wrapped staff in clawed black gloves.",
    },
  },
];
