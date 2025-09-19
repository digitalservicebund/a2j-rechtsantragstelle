import { getGridClass, getPaddingClasses } from "../util";

describe("Grid Util Functions", () => {
  it("returns correct col-span classes for small screens (no breakpoint)", () => {
    expect(getGridClass("col-span", 1)).toBe("col-span-1");
    expect(getGridClass("col-span", 6)).toBe("col-span-6");
    expect(getGridClass("col-span", 12)).toBe("col-span-12");
  });

  it("returns correct col-span classes for md breakpoint", () => {
    expect(getGridClass("col-span", 1, "md")).toBe("md:col-span-1");
    expect(getGridClass("col-span", 6, "md")).toBe("md:col-span-6");
    expect(getGridClass("col-span", 12, "md")).toBe("md:col-span-12");
  });

  it("returns correct col-span classes for lg breakpoint", () => {
    expect(getGridClass("col-span", 1, "lg")).toBe("lg:col-span-1");
    expect(getGridClass("col-span", 6, "lg")).toBe("lg:col-span-6");
    expect(getGridClass("col-span", 12, "lg")).toBe("lg:col-span-12");
  });

  it("returns correct col-span classes for xl breakpoint", () => {
    expect(getGridClass("col-span", 1, "xl")).toBe("xl:col-span-1");
    expect(getGridClass("col-span", 6, "xl")).toBe("xl:col-span-6");
    expect(getGridClass("col-span", 12, "xl")).toBe("xl:col-span-12");
  });

  it("returns correct col-start classes for small screens (no breakpoint)", () => {
    expect(getGridClass("col-start", 1)).toBe("col-start-1");
    expect(getGridClass("col-start", 6)).toBe("col-start-6");
    expect(getGridClass("col-start", 12)).toBe("col-start-12");
  });

  it("returns correct col-start classes for md breakpoint", () => {
    expect(getGridClass("col-start", 1, "md")).toBe("md:col-start-1");
    expect(getGridClass("col-start", 6, "md")).toBe("md:col-start-6");
    expect(getGridClass("col-start", 12, "md")).toBe("md:col-start-12");
  });

  it("returns correct col-start classes for lg breakpoint", () => {
    expect(getGridClass("col-start", 1, "lg")).toBe("lg:col-start-1");
    expect(getGridClass("col-start", 6, "lg")).toBe("lg:col-start-6");
    expect(getGridClass("col-start", 12, "lg")).toBe("lg:col-start-12");
  });

  it("returns correct col-start classes for xl breakpoint", () => {
    expect(getGridClass("col-start", 1, "xl")).toBe("xl:col-start-1");
    expect(getGridClass("col-start", 6, "xl")).toBe("xl:col-start-6");
    expect(getGridClass("col-start", 12, "xl")).toBe("xl:col-start-12");
  });

  it("handles all valid span values", () => {
    const validSpans = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

    validSpans.forEach((span) => {
      expect(getGridClass("col-span", span)).toBe(`col-span-${span}`);
      expect(getGridClass("col-start", span)).toBe(`col-start-${span}`);
      expect(getGridClass("col-span", span, "md")).toBe(`md:col-span-${span}`);
      expect(getGridClass("col-start", span, "md")).toBe(
        `md:col-start-${span}`,
      );
      expect(getGridClass("col-span", span, "lg")).toBe(`lg:col-span-${span}`);
      expect(getGridClass("col-start", span, "lg")).toBe(
        `lg:col-start-${span}`,
      );
      expect(getGridClass("col-span", span, "xl")).toBe(`xl:col-span-${span}`);
      expect(getGridClass("col-start", span, "xl")).toBe(
        `xl:col-start-${span}`,
      );
    });
  });

  it("returns correct padding classes with custom values", () => {
    expect(getPaddingClasses("16", "24")).toBe("pt-16 pb-24");
    expect(getPaddingClasses("32", "48")).toBe("pt-32 pb-48");
    expect(getPaddingClasses("0", "64")).toBe("pt-0 pb-64");
  });

  it("converts 'default' to '40' for both top and bottom", () => {
    expect(getPaddingClasses("default", "default")).toBe("pt-40 pb-40");
    expect(getPaddingClasses("default", "24")).toBe("pt-40 pb-24");
    expect(getPaddingClasses("16", "default")).toBe("pt-16 pb-40");
  });

  it("returns empty string when pt or pb is not provided", () => {
    expect(getPaddingClasses("", "")).toBe("");
    expect(getPaddingClasses("16", "")).toBe("");
    expect(getPaddingClasses("", "24")).toBe("");
  });

  it("handles mixed default and custom values", () => {
    expect(getPaddingClasses("default", "8")).toBe("pt-40 pb-8");
    expect(getPaddingClasses("64", "default")).toBe("pt-64 pb-40");
    expect(getPaddingClasses("default", "0")).toBe("pt-40 pb-0");
  });
});
