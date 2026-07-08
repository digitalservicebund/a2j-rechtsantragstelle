import { describe, expect, it } from "vitest";
import {
  addFractions,
  HALF,
  QUARTER,
  simplify,
  splitEqually,
  subtractFromWhole,
  THREE_QUARTERS,
  WHOLE,
} from "../fraction";

describe("simplify", () => {
  it("reduces a fraction to lowest terms", () => {
    expect(simplify(4, 8)).toEqual({ numerator: 1, denominator: 2 });
    expect(simplify(6, 9)).toEqual({ numerator: 2, denominator: 3 });
  });

  it("leaves an already reduced fraction unchanged", () => {
    expect(simplify(3, 7)).toEqual({ numerator: 3, denominator: 7 });
  });

  it("reduces a whole to 1/1", () => {
    expect(simplify(5, 5)).toEqual(WHOLE);
  });

  it("keeps zero numerators normalized", () => {
    expect(simplify(0, 4)).toEqual({ numerator: 0, denominator: 1 });
  });
});

describe("addFractions", () => {
  it("adds fractions with different denominators", () => {
    // the full-sibling case: one share from each parent's line
    expect(addFractions(simplify(1, 8), simplify(1, 6))).toEqual({
      numerator: 7,
      denominator: 24,
    });
  });

  it("returns a simplified result", () => {
    expect(addFractions(QUARTER, QUARTER)).toEqual(HALF);
    expect(addFractions(HALF, HALF)).toEqual(WHOLE);
  });
});

describe("splitEqually", () => {
  it("splits a share into equal parts", () => {
    expect(splitEqually(HALF, 2)).toEqual(QUARTER);
    expect(splitEqually(WHOLE, 3)).toEqual({ numerator: 1, denominator: 3 });
  });

  it("returns the same share for a single part", () => {
    expect(splitEqually(THREE_QUARTERS, 1)).toEqual(THREE_QUARTERS);
  });

  it("simplifies the result", () => {
    expect(splitEqually(simplify(2, 3), 2)).toEqual({
      numerator: 1,
      denominator: 3,
    });
  });
});

describe("subtractFromWhole", () => {
  it("returns the complement of a fraction", () => {
    expect(subtractFromWhole(QUARTER)).toEqual(THREE_QUARTERS);
    expect(subtractFromWhole(HALF)).toEqual(HALF);
  });

  it("returns zero for a whole", () => {
    expect(subtractFromWhole(WHOLE)).toEqual({ numerator: 0, denominator: 1 });
  });
});
