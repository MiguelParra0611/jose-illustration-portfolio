import { ContactActions } from "@/components/ContactActions";
import { Logo } from "@/components/Logo";
import { SITE_COPY } from "@/lib/site-copy";

/**
 * Closing block, and the target of the hero's "Work with me" button. Dark and
 * solid like IntroScreen, so the page is bookended by two ink cards around the
 * light gallery; it arrives as a plain static block, with no scroll-tied effect.
 */
export function Contact() {
  const { eyebrow, heading, text } = SITE_COPY.contact;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="flex min-h-svh flex-col items-center justify-center gap-8 bg-ink px-6 py-24 text-center text-white"
    >
      <Logo title={null} className="w-[clamp(3.5rem,10vh,6rem)] text-white" />

      <p className="font-mono text-xs uppercase tracking-[0.3em] text-vermilion">
        {"// "}
        {eyebrow}
      </p>

      {/* 8.6vw, not IntroScreen's 6vw: Unbounded is wide and "SOMETHING" can't wrap, so this is the largest size that still fits inside the 24px gutters down to ~230px wide. */}
      <h2
        id="contact-heading"
        className="font-display text-[clamp(1.25rem,8.6vw,3.25rem)] font-bold uppercase leading-[1.05] tracking-tight"
      >
        {heading}
      </h2>

      <p className="max-w-md text-base leading-relaxed text-white/70">{text}</p>

      <ContactActions />
    </section>
  );
}
