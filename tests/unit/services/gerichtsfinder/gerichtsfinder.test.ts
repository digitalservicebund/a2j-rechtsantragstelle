import {
  applyDataConversions,
  gerbehIndex,
  normalizeFilepath,
} from "~/services/gerichtsfinder/convertJsonDataTable";
import type { GerbehIndex } from "~/services/gerichtsfinder/convertJsonDataTable";

describe("gerbehIndex", () => {
  const index: GerbehIndex = {
    LKZ: "a",
    OLG: "b",
    LG: "c",
    AG: "d",
    typInfo: "Finanzgericht",
  };

  it("generates a reproducable index", () => {
    expect(gerbehIndex(index)).toBe(gerbehIndex(index));
  });

  it("generates different index for non-equal inputs", () => {
    expect(
      gerbehIndex({
        LKZ: "aa",
        OLG: "b",
        LG: "c",
        AG: "d",
        typInfo: "Finanzgericht",
      })
    ).not.toBe(gerbehIndex(index));
  });
});

describe("normalizeFilepath", () => {
  it("normalizes relative paths", () => {
    expect(normalizeFilepath("./relative")).toBe(`${process.cwd()}/relative`);
  });

  it("normalizes absolute paths", () => {
    expect(normalizeFilepath("/absolute")).toBe(`/absolute`);
  });
});

describe("applyDataConversions", () => {
  it("handles empty object", () => {
    expect(applyDataConversions({})).toEqual({});
  });
});
