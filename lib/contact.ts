/**
 * Where to reach José.
 *
 * The email is stored in two halves and only joined in the browser (see
 * ContactActions.tsx), so the address never appears as one plain string in
 * the page's HTML. That's a cheap barrier against the simplest scrapers, which
 * harvest addresses with a regex; anything that runs JavaScript can still read
 * it. Never call emailAddress() while rendering on the server.
 */
export const CONTACT = {
  instagram: { handle: "jgut.art", url: "https://www.instagram.com/jgut.art/" },
  email: { user: "josegut.art", domain: "gmail.com" },
} as const;

export const emailAddress = (): string => `${CONTACT.email.user}@${CONTACT.email.domain}`;

/**
 * Gmail's compose window, already addressed to José. It's web Gmail, so the
 * link opens in a new tab and asks the visitor to sign in if they aren't;
 * anyone who'd rather use their own mail app has `mailtoHref()` instead. Like
 * emailAddress(), never call it while rendering on the server.
 */
export const gmailComposeHref = (): string => {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: emailAddress() });
  return `https://mail.google.com/mail/?${params}`;
};

/** Falls back to whatever mail app the visitor's OS/browser has set as default. */
export const mailtoHref = (): string => `mailto:${emailAddress()}`;
