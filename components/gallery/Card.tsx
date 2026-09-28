import { isLandscape, type Illustration } from "@/lib/illustrations";

/**
 * Stand-in visual for pieces that don't have real artwork yet: a dark,
 * ink-toned gradient with a faint index number, reading as an intentional
 * placeholder rather than a broken image.
 */
export function PlaceholderArt({ index }: { index: number }) {
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

interface CardProps {
  illustration: Illustration;
  index: number;
  onOpen: (slug: string) => void;
  /** Registers this card's clickable box as the GSAP Flip target for its slug (see Gallery.tsx). */
  boxRef: (el: HTMLButtonElement | null) => void;
}

export function Card({ illustration, index, onOpen, boxRef }: CardProps) {
  const { image } = illustration;

  // Portraits are 3:4. A landscape piece spans two columns from `sm` up; from
  // `lg` its height comes from the portrait beside it (grid stretch), so it
  // only needs its own ratio where it sits alone in a row.
  const shape =
    image && isLandscape(image) ? "aspect-[3/2] sm:col-span-2 lg:aspect-auto" : "aspect-[3/4]";

  return (
    <li className={`gallery-card relative overflow-hidden rounded-2xl bg-ink ${shape}`}>
      <button
        ref={boxRef}
        type="button"
        onClick={() => onOpen(illustration.slug)}
        className="group absolute inset-0 h-full w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        aria-haspopup="dialog"
      >
        {image ? (
          // Plain <img>: scripts/optimize-illustrations.mjs already produced the right sizes, so
          // next/image's optimizer would only re-process them. alt="" because the title below names the button.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.card}
            alt=""
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            style={{ objectPosition: image.focus }}
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
      </button>
    </li>
  );
}
