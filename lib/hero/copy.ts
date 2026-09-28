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
  /**
   * Static title card, shown immediately on load, before the scroll-driven
   * hero and independent of it loading its frames. See components/IntroScreen.tsx.
   */
  intro: {
    title: "Behind the mask",
    status: "Signal incoming",
  },

  /**
   * Headline on frame 1 of the canvas hero, one entry per line, shown in
   * capitals. Kept distinct from `intro.title` ("Behind the mask") so the
   * same phrase doesn't appear twice a few seconds apart.
   */
  tagline: ["Concept", "artist"],

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
    /** Where the button scrolls to: the id of the contact section (components/Contact.tsx). */
    target: "#contact",
  },
} as const;
