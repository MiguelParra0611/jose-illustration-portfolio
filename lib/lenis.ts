import type Lenis from "lenis";

// SmoothScroll owns the Lenis instance; other components (the hero CTA) borrow it
// to scroll with the same easing instead of jumping.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}
