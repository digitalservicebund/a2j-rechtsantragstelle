import { evaluateRoute, extractEdges, evaluateAllBranches } from "../routing";

const noData = { pageData: { arrayIndexes: [] } };

describe("evaluateRoute", () => {
  it("returns null for undefined route", () => {
    expect(evaluateRoute(undefined, noData)).toBeNull();
  });

  it("returns null for null route", () => {
    expect(evaluateRoute(null, noData)).toBeNull();
  });

  it("returns the string target directly", () => {
    expect(evaluateRoute("step2", noData)).toBe("step2");
  });

  it("returns first passing guard target", () => {
    const route = [
      { target: "a", guard: () => false },
      { target: "b", guard: () => true },
      { target: "c", guard: () => true },
    ];
    expect(evaluateRoute(route, noData)).toBe("b");
  });

  it("returns null when no guard passes", () => {
    const route = [
      { target: "a", guard: () => false },
      { target: "b", guard: () => false },
    ];
    expect(evaluateRoute(route, noData)).toBeNull();
  });

  it("returns target when no guard is specified", () => {
    const route = [{ target: "a" }];
    expect(evaluateRoute(route, noData)).toBe("a");
  });

  it("skips addArrayItem transition when traverseArrays is false", () => {
    const route = [
      { target: "item", type: "addArrayItem" as const },
      { target: "next" },
    ];
    expect(evaluateRoute(route, noData, false)).toBe("next");
  });

  it("returns addArrayItem target when traverseArrays is true", () => {
    const route = [
      { target: "item", type: "addArrayItem" as const },
      { target: "next" },
    ];
    expect(evaluateRoute(route, noData, true)).toBe("item");
  });

  it("passes data to guard function", () => {
    const route = [
      {
        target: "yes",
        guard: (d: { flag?: boolean }) => d.flag === true,
      },
      { target: "no" },
    ];
    expect(evaluateRoute(route, { flag: true, pageData: { arrayIndexes: [] } })).toBe("yes");
    expect(evaluateRoute(route, { flag: false, pageData: { arrayIndexes: [] } })).toBe("no");
  });
});

describe("extractEdges", () => {
  it("returns empty array for undefined", () => {
    expect(extractEdges(undefined)).toEqual([]);
  });

  it("returns empty array for null", () => {
    expect(extractEdges(null)).toEqual([]);
  });

  it("returns [string] for a string route", () => {
    expect(extractEdges("step2")).toEqual(["step2"]);
  });

  it("returns all non-null targets from array route", () => {
    const route = [{ target: "a" }, { target: null }, { target: "b" }];
    expect(extractEdges(route)).toEqual(["a", "b"]);
  });

  it("returns empty array when all targets are null", () => {
    expect(extractEdges([{ target: null }])).toEqual([]);
  });

  it("includes addArrayItem targets", () => {
    const route = [
      { target: "item", type: "addArrayItem" as const },
      { target: "next" },
    ];
    expect(extractEdges(route)).toEqual(["item", "next"]);
  });
});

describe("evaluateAllBranches", () => {
  it("returns empty array for undefined", () => {
    expect(evaluateAllBranches(undefined, noData)).toEqual([]);
  });

  it("returns empty array for null", () => {
    expect(evaluateAllBranches(null, noData)).toEqual([]);
  });

  it("returns [string] for a string route", () => {
    expect(evaluateAllBranches("step2", noData)).toEqual(["step2"]);
  });

  it("collects all passing-guard targets, not just first", () => {
    const route = [
      { target: "a", guard: () => true },
      { target: "b", guard: () => false },
      { target: "c", guard: () => true },
    ];
    expect(evaluateAllBranches(route, noData)).toEqual(["a", "c"]);
  });

  it("includes targets without a guard", () => {
    const route = [
      { target: "a" },
      { target: "b", guard: () => false },
      { target: "c" },
    ];
    expect(evaluateAllBranches(route, noData)).toEqual(["a", "c"]);
  });

  it("filters null targets even when guard passes", () => {
    const route = [
      { target: null, guard: () => true },
      { target: "a" },
    ];
    expect(evaluateAllBranches(route, noData)).toEqual(["a"]);
  });
});
