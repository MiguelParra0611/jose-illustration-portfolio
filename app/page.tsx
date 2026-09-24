import { ScrollHero } from "@/components/hero/ScrollHero";

export default function Home() {
  return (
    <>
      <ScrollHero />

      {/* Placeholder for the gallery (checkpoint 3): proves the hero hands over to normal scrolling. */}
      <section id="contact" className="flex min-h-svh items-center justify-center bg-paper text-ink">
        <p className="font-mono text-xs tracking-[0.2em]">{"// GALLERY — CHECKPOINT 3"}</p>
      </section>
    </>
  );
}
