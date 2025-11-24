import { parseArrayIndexesFromPathname } from "~/services/array/parseArrayIndexesFromPathname";

describe("parseArrayIndexesFromPathname()", () => {
  it("returns empty array when pathname has no numeric segments", () => {
    expect(parseArrayIndexesFromPathname("/flow/subflow/subsubflow")).toEqual(
      [],
    );
  });

  it("returns empty array for empty pathname", () => {
    expect(parseArrayIndexesFromPathname("")).toEqual([]);
  });

  it("returns single index from pathname", () => {
    expect(parseArrayIndexesFromPathname("/flow/0/subflow")).toEqual([0]);
  });

  it("returns multiple indexes from pathname and handles multi-digit indexes", () => {
    expect(
      parseArrayIndexesFromPathname("/flow/51/subflow/486/subsubflow"),
    ).toEqual([51, 486]);
  });

  it("ignores numeric parts that are not separate segments", () => {
    expect(parseArrayIndexesFromPathname("/flow123/subflow456")).toEqual([]);
  });

  it("handles indexes at the start of pathname", () => {
    expect(parseArrayIndexesFromPathname("/0/flow/subflow")).toEqual([0]);
  });

  it("handles indexes at the end of pathname", () => {
    expect(parseArrayIndexesFromPathname("/flow/subflow/5")).toEqual([5]);
  });
});
