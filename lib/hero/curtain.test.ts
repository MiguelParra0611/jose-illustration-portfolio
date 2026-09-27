import { describe, expect, it } from "vitest";
import { CURTAIN_START, curtainAmount } from "./curtain";

describe("curtainAmount", () => {
  it("is 0 up to CURTAIN_START and 1 at the end", () => {
    expect(curtainAmount(0)).toBe(0);
    expect(curtainAmount(CURTAIN_START)).toBe(0);
    expect(curtainAmount(1)).toBe(1);
  });

  it("clamps outside 0..1", () => {
    expect(curtainAmount(-1)).toBe(0);
    expect(curtainAmount(2)).toBe(1);
  });

  it("rises monotonically between CURTAIN_START and 1", () => {
    let previous = 0;

    for (let i = 0; i <= 100; i++) {
      const progress = CURTAIN_START + (1 - CURTAIN_START) * (i / 100);
      const amount = curtainAmount(progress);

      expect(amount).toBeGreaterThanOrEqual(previous - 1e-12);
      previous = amount;
    }
  });
});
