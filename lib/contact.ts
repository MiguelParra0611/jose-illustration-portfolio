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

export const mailtoHref = (): string => `mailto:${emailAddress()}`;
