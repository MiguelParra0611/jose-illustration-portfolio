import { SITE_COPY } from "@/lib/site-copy";

/**
 * Solid, full-height chapter title between the hero and the illustration
 * grid — no fade, no scroll-tied transition, on purpose: it should arrive
 * exactly the way IntroScreen does, as a plain static block.
 */
export function GalleryIntro() {
  return (
    <section className="flex h-svh items-center justify-center bg-paper px-6 text-center">
      <h2
        id="gallery-heading"
        className="font-mono text-sm uppercase tracking-[0.3em] text-ink sm:text-base"
      >
        {"// "}
        {SITE_COPY.gallery.chapterTitle}
      </h2>
    </section>
  );
}
