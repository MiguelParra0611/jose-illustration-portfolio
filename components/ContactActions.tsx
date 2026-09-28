"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT, emailAddress, gmailComposeHref } from "@/lib/contact";

const PILL =
  "group inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/30 px-7 py-4 font-display text-sm font-bold uppercase tracking-tight text-white outline-none transition-colors hover:border-white hover:bg-white hover:text-ink focus-visible:border-white focus-visible:bg-white focus-visible:text-ink focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto";

const SECONDARY =
  "font-mono text-[11px] uppercase tracking-[0.25em] text-white/60 underline-offset-4 outline-none transition-colors hover:text-white hover:underline focus-visible:text-white focus-visible:underline focus-visible:decoration-vermilion";

/**
 * Instagram and email. The address is only ever joined here, in the browser
 * (see lib/contact.ts): the Gmail compose link gets its href after mount, and
 * the address is only written into the page once someone asks to copy it.
 */
export function ContactActions() {
  const emailRef = useRef<HTMLAnchorElement>(null);
  const [revealed, setRevealed] = useState<"copied" | "shown" | null>(null);

  useEffect(() => {
    if (emailRef.current) emailRef.current.href = gmailComposeHref();
  }, []);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(emailAddress());
      setRevealed("copied");
    } catch {
      // Clipboard blocked (or unavailable): show the address so it can be copied by hand.
      setRevealed("shown");
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 sm:w-auto sm:max-w-none sm:flex-row">
        <a href={CONTACT.instagram.url} target="_blank" rel="noopener noreferrer" className={PILL}>
          Instagram
          <span className="font-mono text-[11px] font-normal normal-case tracking-normal opacity-70">
            @{CONTACT.instagram.handle}
          </span>
          <span aria-hidden="true" className="text-vermilion group-hover:text-ink group-focus-visible:text-ink">
            ↗
          </span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>

        {/* No href in the server HTML: it's assigned after mount, so the address isn't in the markup. */}
        <a ref={emailRef} target="_blank" rel="noopener noreferrer" className={PILL}>
          Email
          <span aria-hidden="true" className="text-vermilion group-hover:text-ink group-focus-visible:text-ink">
            ↗
          </span>
          <span className="sr-only">(opens Gmail in a new tab)</span>
        </a>
      </div>

      <button type="button" onClick={copyAddress} className={SECONDARY}>
        Copy email address
      </button>

      <p role="status" className="min-h-5 font-mono text-xs text-white/80">
        {revealed === "copied" && <span className="text-vermilion">Copied · </span>}
        {revealed && emailAddress()}
      </p>
    </div>
  );
}
