import { allOtherSectionsDone } from "../newEngineFormular.server";

describe("allOtherSectionsDone", () => {
  it("returns true when every other section is done", () => {
    const statusTree = {
      "/a": { isDone: true, isReachable: true },
      "/b": { isDone: true, isReachable: true },
      "/abgabe": { isDone: false, isReachable: true },
    };
    expect(allOtherSectionsDone(statusTree, "/abgabe")).toBe(true);
  });

  it("returns false when a reachable other section is not done", () => {
    const statusTree = {
      "/a": { isDone: false, isReachable: true },
      "/abgabe": { isDone: false, isReachable: true },
    };
    expect(allOtherSectionsDone(statusTree, "/abgabe")).toBe(false);
  });

  it("ignores unreachable (disabled) sections that are not done", () => {
    const statusTree = {
      "/a": { isDone: true, isReachable: true },
      "/disabled": { isDone: false, isReachable: false },
      "/abgabe": { isDone: false, isReachable: true },
    };
    expect(allOtherSectionsDone(statusTree, "/abgabe")).toBe(true);
  });

  it("does not exclude a section other than the given one", () => {
    const statusTree = {
      "/a": { isDone: false, isReachable: true },
      "/abgabe": { isDone: true, isReachable: true },
    };
    expect(allOtherSectionsDone(statusTree, "/abgabe")).toBe(false);
  });
});
