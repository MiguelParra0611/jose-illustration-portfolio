import { IntroScreen } from "@/components/IntroScreen";
import { Gallery } from "@/components/gallery/Gallery";
import { GalleryIntro } from "@/components/gallery/GalleryIntro";
import { ScrollHero } from "@/components/hero/ScrollHero";

export default function Home() {
  return (
    <>
      <IntroScreen />
      <ScrollHero />
      <GalleryIntro />
      <Gallery />

      {/* Placeholder for contact (checkpoint 5): the hero CTA scrolls here. */}
      <section id="contact" className="flex min-h-svh items-center justify-center bg-paper text-ink">
        <p className="font-mono text-xs tracking-[0.2em]">{"// CONTACT — CHECKPOINT 5"}</p>
      </section>
    </>
  );
}
