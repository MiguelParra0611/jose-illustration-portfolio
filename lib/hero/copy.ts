/**
 * Every word shown over the hero lives here.
 *
 * The Japanese strings are rendered with a font trimmed down to just the glyphs
 * used below. After adding or changing any Japanese text run
 * `npm run subset:font`, otherwise the new characters fall back to a system font.
 *
 * Have a native speaker review the Japanese before launch.
 */
export const HERO_COPY = {
  /** Headline, one entry per line. Shown in capitals. */
  tagline: ["Behind", "the mask"],

  /** Vertical column that covers the figure's face in the first frame ("beyond the mask"). */
  curtain: "仮面の向こうに",

  scrollCue: "Scroll",

  /** Small vertical kanji on the right edge, keyed by frame index. */
  edgeKanji: {
    1: "影", // kage: shadow
    2: "幻", // maboroshi: illusion
    3: "絵師", // eshi: illustrator
  } as Record<number, string>,

  subjectLocated: "Subject located",
  portfolio: "This is my portfolio.",
  /** Two short lines so it never collides with the left-hand copy on narrow screens. */
  signal: ["Tokyo // 23:47", "Signal found"],
  endOfSignal: "End of signal",

  cta: {
    label: "Work with me",
    /** "Requests / commissions here". */
    note: "ご依頼はこちら",
    /** Where the button scrolls to. The contact block arrives in a later checkpoint. */
    target: "#contact",
  },
} as const;
