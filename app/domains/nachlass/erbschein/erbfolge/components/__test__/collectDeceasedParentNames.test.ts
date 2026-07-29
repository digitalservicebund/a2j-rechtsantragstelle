import { describe, expect, it } from "vitest";
import { collectDeceasedParentNames } from "../summaryTree";
import type { KindItem } from "../types";

describe("collectDeceasedParentNames", () => {
  const items = [
    {
      name: "Kind 1",
      isAlive: "no",
      hatteKinder: "yes",
      kinder: [
        { name: "Enkelkind 1", isAlive: "no", hatteKinder: "yes" },
        { name: "Enkelkind 2", isAlive: "yes" },
      ],
    },
    { name: "Kind 2", isAlive: "yes" },
    { name: "Kind 3", isAlive: "no", hatteKinder: "no" },
  ] as unknown as KindItem[];

  it("lists deceased members with children at the given depth", () => {
    expect(collectDeceasedParentNames(items, 1)).toEqual(["Kind 1"]);
  });

  it("finds deceased parents at deeper levels", () => {
    expect(collectDeceasedParentNames(items, 2)).toEqual(["Enkelkind 1"]);
  });

  it("returns an empty list when nobody qualifies", () => {
    expect(collectDeceasedParentNames(items, 3)).toEqual([]);
  });
});
