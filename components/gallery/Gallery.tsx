"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ILLUSTRATIONS } from "@/lib/illustrations";
import { Card } from "./Card";
import { DetailDialog } from "./DetailDialog";

gsap.registerPlugin(ScrollTrigger);

const SLUGS = new Set(ILLUSTRATIONS.map((illustration) => illustration.slug));

/**
 * The illustration grid. GalleryIntro (rendered right before this in
 * app/page.tsx) carries the section's visible heading and its id, so this
 * only needs an aria-labelledby to stay linked to it. Cards fade and rise in,
 * staggered, the first time the grid scrolls into view.
 *
 * Opening a card shows DetailDialog, GSAP-Flipping the image from that
 * card's exact box (tracked in cardBoxRefs, keyed by slug) to the dialog and
 * back. The open piece is mirrored to the URL hash so it can be linked to
 * directly; replaceState is used throughout to avoid piling up history
 * entries for what's ultimately one page.
 */
export function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardBoxRefs = useRef(new Map<string, HTMLButtonElement>());
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = gsap.utils.toArray<HTMLElement>(".gallery-card");

      gsap.set(cards, { autoAlpha: 0, y: 40 });
      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  // Open directly from a link like /#character-concept. Deferred to an effect
  // (rather than a lazy useState initializer) so the server-rendered markup
  // — which has no notion of the URL fragment — matches the client's first
  // render and hydration doesn't mismatch.
  useEffect(() => {
    const slug = window.location.hash.slice(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
    if (SLUGS.has(slug)) setActiveSlug(slug);
  }, []);

  useEffect(() => {
    const url = activeSlug ? `#${activeSlug}` : window.location.pathname + window.location.search;
    window.history.replaceState(null, "", url);
  }, [activeSlug]);

  const activeIndex = ILLUSTRATIONS.findIndex((illustration) => illustration.slug === activeSlug);
  const activeIllustration = activeIndex === -1 ? null : ILLUSTRATIONS[activeIndex];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="gallery-heading"
      className="bg-paper px-[var(--gutter)] py-24 text-ink"
    >
      <div className="mx-auto max-w-6xl">
        <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ILLUSTRATIONS.map((illustration, index) => (
            <Card
              key={illustration.slug}
              illustration={illustration}
              index={index}
              onOpen={setActiveSlug}
              boxRef={(el) => {
                if (el) cardBoxRefs.current.set(illustration.slug, el);
                else cardBoxRefs.current.delete(illustration.slug);
              }}
            />
          ))}
        </ul>
      </div>

      <DetailDialog
        illustration={activeIllustration}
        index={activeIndex === -1 ? 0 : activeIndex}
        getCardBox={(slug) => cardBoxRefs.current.get(slug) ?? null}
        onClose={() => setActiveSlug(null)}
      />
    </section>
  );
}
