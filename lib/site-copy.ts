/**
 * Copy for sections outside the hero (the hero's own words live in
 * lib/hero/copy.ts). Extended in later checkpoints as the contact section
 * and detail view are built.
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
} as const;
