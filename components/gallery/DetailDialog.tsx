"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { isLandscape, type Illustration } from "@/lib/illustrations";
import { resolveSpeedDrawing } from "@/lib/speed-drawing";
import { PlaceholderArt } from "./Card";

gsap.registerPlugin(Flip);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;

/**
 * Flip animates width/height (not scaleX/scaleY): the card crops the art to 3:4
 * or 3:2 while the detail view shows all of it, and scaling a box between two
 * different aspect ratios would visibly stretch the picture in flight. With
 * real sizes the images (object-cover) simply re-crop smoothly as the box grows.
 */
const FLIP_BASE = { absolute: true, scale: false } as const;

interface DetailDialogProps {
  illustration: Illustration | null;
  /** Looks up the grid card a slug opened from, so the image can Flip to/from its exact box. */
  getCardBox: (slug: string) => HTMLButtonElement | null;
  index: number;
  onClose: () => void;
}

/**
 * A single, always-mounted native <dialog>, its content swapped per
 * `illustration`. The image box GSAP-Flips to and from the clicked card's
 * box (see Gallery.tsx for how cards register themselves); the rest of the
 * chrome fades in alongside it. ESC and backdrop clicks both run the same
 * animated close as the button, via the dialog's `cancel` event.
 *
 * The artwork is always shown whole, at its own aspect ratio: a portrait sits
 * beside the text from `lg` up, a landscape piece (and everything below `lg`)
 * stacks above it. The picture pane holds that size in flow while the image
 * box inside it (absolutely positioned) is what Flip moves, so animating it
 * never reflows the dialog.
 */
export function DetailDialog({ illustration, getCardBox, index, onClose }: DetailDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  // Open: show the native dialog, then Flip the image box in from the card's box.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const imageBox = imageBoxRef.current;
    if (!illustration || !dialog) return;

    closingRef.current = false;
    if (!dialog.open) dialog.showModal();

    const cardBoxEl = getCardBox(illustration.slug);

    if (imageBox && cardBoxEl && !reducedMotion()) {
      // Finish any flip already in flight first (e.g. React 19's dev-only
      // double-invoke of effects), so this reads a settled card box rather
      // than one mid-tween.
      Flip.killFlipsOf(imageBox, true);
      // Flip.from() animates its targets FROM the recorded state TO wherever
      // they currently sit — so record the card's (small) box, and apply
      // that onto the dialog's image box, which is already laid out at its
      // natural (large) size. No need to touch the image box beforehand.
      const cardState = Flip.getState(cardBoxEl);
      Flip.from(cardState, {
        targets: imageBox,
        duration: 0.55,
        ease: "power2.inOut",
        ...FLIP_BASE,
      });
    }

    gsap.fromTo(
      panelRef.current,
      { autoAlpha: 0, y: reducedMotion() ? 0 : 16 },
      { autoAlpha: 1, y: 0, duration: 0.4, delay: reducedMotion() ? 0 : 0.15 },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the identity of the opened piece should retrigger this
  }, [illustration?.slug]);

  function requestClose() {
    if (closingRef.current || !illustration) return;
    closingRef.current = true;

    const dialog = dialogRef.current;
    const imageBox = imageBoxRef.current;
    const cardBoxEl = getCardBox(illustration.slug);

    const finish = () => {
      dialog?.close();
      onClose();
    };

    if (imageBox && cardBoxEl && !reducedMotion()) {
      gsap.to(panelRef.current, { autoAlpha: 0, duration: 0.15 });

      // Symmetric with the open effect: record the current (large) box, snap
      // to the card's box instantly, then Flip.from() animates back from the
      // recorded large state to that now-current (small) one. Flip.from()
      // returns a real GSAP timeline, so onComplete is guaranteed to fire —
      // Flip.fit()'s return value isn't reliably a tween across option combos.
      Flip.killFlipsOf(imageBox, true);
      const openState = Flip.getState(imageBox);
      Flip.fit(imageBox, cardBoxEl, FLIP_BASE);
      Flip.from(openState, {
        targets: imageBox,
        duration: 0.45,
        ease: "power2.inOut",
        ...FLIP_BASE,
        onComplete: finish,
      });
    } else {
      finish();
    }
  }

  // ESC fires `cancel` before the dialog closes natively — intercept it so the
  // close still animates. Rebound whenever `illustration` changes: requestClose
  // closes over the current props, and a stale closure from a one-time (`[]`)
  // effect would always see the `illustration` that was current at mount.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      requestClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- requestClose is recreated with illustration each render; re-subscribing keeps it fresh
  }, [illustration]);

  const speedDrawing = illustration?.speedDrawing ? resolveSpeedDrawing(illustration.speedDrawing) : null;

  const image = illustration?.image ?? null;
  const landscape = image ? isLandscape(image) : false;
  const paneStyle = { "--ar": image ? image.width / image.height : 3 / 4 } as CSSProperties;
  const meta = illustration
    ? [illustration.year, ...(illustration.tools ?? [])].filter(Boolean).join(" · ")
    : "";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="detail-title"
      className="detail-dialog"
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose();
      }}
    >
      {illustration && (
        <div
          className={`relative mx-auto flex max-h-full w-full flex-col overflow-y-auto rounded-2xl bg-paper ${
            landscape ? "max-w-4xl" : "max-w-6xl lg:h-[min(85vh,52rem)] lg:flex-row lg:overflow-hidden"
          }`}
        >
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-lg text-white outline-none backdrop-blur-sm transition-colors hover:bg-ink focus-visible:ring-2 focus-visible:ring-vermilion"
          >
            ✕
          </button>

          {/* Holds the artwork's size in flow; never taller than ~62vh when stacked, so text stays in reach. */}
          <div
            style={{ ...paneStyle, aspectRatio: "var(--ar)" }}
            className={`relative mx-auto mt-6 w-[min(100%,calc(62vh*var(--ar)))] shrink-0 sm:mt-8 ${
              landscape ? "" : "lg:mx-0 lg:mt-0 lg:h-full lg:w-auto"
            }`}
          >
            <div ref={imageBoxRef} className="absolute inset-0 overflow-hidden bg-ink">
              {image ? (
                <>
                  {/* Plain <img>s: sizes come pre-generated from scripts/optimize-illustrations.mjs.
                      The card-size image is already cached from the grid, so it fills the box the
                      instant it opens; the full-size one paints over it once it has loaded. */}
                  {/* eslint-disable @next/next/no-img-element */}
                  <img
                    src={image.card}
                    alt=""
                    style={{ objectPosition: image.focus }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <img
                    src={image.full}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    decoding="async"
                    style={{ objectPosition: image.focus }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* eslint-enable @next/next/no-img-element */}
                </>
              ) : (
                <PlaceholderArt index={index} />
              )}
            </div>
          </div>

          <div
            ref={panelRef}
            className={`flex-1 p-6 text-ink sm:p-8 ${
              landscape ? "mx-auto w-full max-w-2xl" : "lg:overflow-y-auto"
            }`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-vermilion">
              {illustration.discipline}
            </p>
            <h3
              id="detail-title"
              className="mt-2 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl"
            >
              {illustration.title}
            </h3>
            {meta && <p className="mt-1 font-mono text-xs text-fog">{meta}</p>}
            <p className="mt-4 text-sm leading-relaxed text-ink/80">{illustration.description}</p>

            {speedDrawing && (
              <div className="mt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
                  Speed drawing
                </p>
                {speedDrawing.kind === "youtube" ? (
                  <div className="mt-2 aspect-video overflow-hidden rounded-lg bg-ink">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${speedDrawing.id}`}
                      title={`${illustration.title} — speed drawing`}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                ) : (
                  <video
                    controls
                    preload="none"
                    playsInline
                    className="mt-2 w-full rounded-lg bg-ink"
                    src={speedDrawing.id}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
