import type { SVGProps } from "react";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo";

type LogoProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
  /** Accessible name. Pass `null` to mark the logo as decorative. */
  title?: string | null;
};

/**
 * The j.gut mask. Transparent background, painted with `currentColor`,
 * so colour it with a text colour class (e.g. `text-white`).
 */
export function Logo({ title = "j.gut mask logo", ...props }: LogoProps) {
  const decorative = title === null;

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      fill="currentColor"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      {...props}
    >
      <path fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  );
}
