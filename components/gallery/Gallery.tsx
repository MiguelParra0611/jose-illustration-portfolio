"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ILLUSTRATIONS } from "@/lib/illustrations";
import { Card } from "./Card";

gsap.registerPlugin(ScrollTrigger);

/**
 * The illustration grid. GalleryIntro (rendered right before this in
 * app/page.tsx) carries the section's visible heading and its id, so this
 * only needs an aria-labelledby to stay linked to it. Cards fade and rise in,
 * staggered, the first time the grid scrolls into view. Clicking a card to
 * see the full piece and its speed drawing arrives in checkpoint 4.
 */
export function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      ref={sectionRef}
      aria-labelledby="gallery-heading"
      className="bg-paper px-[var(--gutter)] py-24 text-ink"
    >
      <div className="mx-auto max-w-6xl">
        <ul className="grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ILLUSTRATIONS.map((illustration, index) => (
            <Card key={illustration.slug} illustration={illustration} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
