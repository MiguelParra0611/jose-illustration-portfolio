/**
 * Copy for sections outside the hero (the hero's own words live in
 * lib/hero/copy.ts). Contact details (handles, address) live in lib/contact.ts.
 */
export const SITE_COPY = {
  gallery: {
    /**
     * Shown alone on a solid, full-height "chapter title" block (see
     * GalleryIntro.tsx) between the hero and the illustration grid. No
     * animation: it's meant to arrive as a plain, static section on scroll,
     * the same way the hero's own intro card does.
     */
    chapterTitle: "My work — illustrations",
  },

  contact: {
    /** Cryptic mono line, in the spirit of the hero's "Signal incoming". */
    eyebrow: "Open channel",
    /** Deliberately not "Work with me": that's the hero's call to action, and the same phrase twice reads as repetition. */
    heading: "Got something in mind?",
    text: "Get in touch and let's work together.",
  },
} as const;
