import { describe, expect, it } from "vitest";
import { CONTACT, emailAddress, mailtoHref } from "./contact";

describe("contact details", () => {
  it("joins the two halves into José's address", () => {
    expect(emailAddress()).toBe("josegut.art@gmail.com");
    expect(mailtoHref()).toBe("mailto:josegut.art@gmail.com");
  });

  it("keeps the address split, so no half is a full email on its own", () => {
    expect(CONTACT.email.user).not.toContain("@");
    expect(CONTACT.email.domain).not.toContain("@");
  });

  it("points to José's Instagram over https, on the handle it displays", () => {
    const { handle, url } = CONTACT.instagram;

    expect(url.startsWith("https://www.instagram.com/")).toBe(true);
    expect(url).toContain(`/${handle}/`);
  });
});
