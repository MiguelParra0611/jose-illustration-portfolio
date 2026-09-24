// Film grain: fractal noise turned into white specks with varying alpha, tiled.
const GRAIN_IMAGE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.4 0 0 0 -0.55'/></filter>" +
  "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/**
 * Cinematic finish over the canvas: darkened top and bottom so text stays
 * readable, a vignette, and slow-shifting film grain. Grain also hides how
 * soft the 1376px source frames get on large screens.
 */
export function Atmosphere() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: [
            "linear-gradient(to top, rgba(7,7,13,0.78) 0%, rgba(7,7,13,0.28) 26%, transparent 52%)",
            "linear-gradient(to bottom, rgba(7,7,13,0.5) 0%, transparent 24%)",
            "radial-gradient(ellipse at center, transparent 52%, rgba(7,7,13,0.55) 100%)",
          ].join(","),
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div
          className="hero-grain absolute -inset-1/2 opacity-[0.16]"
          style={{ backgroundImage: GRAIN_IMAGE, backgroundSize: "240px 240px" }}
        />
      </div>
    </>
  );
}
