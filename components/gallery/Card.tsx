import type { Illustration } from "@/lib/illustrations";

/**
 * Stand-in visual for pieces that don't have real artwork yet: a dark,
 * ink-toned gradient with a faint index number, reading as an intentional
 * placeholder rather than a broken image.
 */
function PlaceholderArt({ index }: { index: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink via-ink to-vermilion/25"
    >
      <span className="font-display text-[5rem] font-bold text-white/10 sm:text-[6rem]">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

export function Card({ illustration, index }: { illustration: Illustration; index: number }) {
  return (
    <li className="gallery-card group relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink">
      {illustration.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- swapped for next/image with real assets in checkpoint 5
        <img
          src={illustration.image}
          alt={illustration.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <PlaceholderArt index={index} />
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent p-5 pt-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
          {illustration.discipline}
        </p>
        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white">
          {illustration.title}
        </h3>
      </div>
    </li>
  );
}
