import {
  collectMissingChildrenNames,
  collectMissingChildrenNamesForElternteile,
} from "../missingChildren";

describe("collectMissingChildrenNames", () => {
  it("flags Kind 1 (not Kind 2) when a grandchild is physically under Kind 1 but reassigned to Kind 2 via parentKindIndex", () => {
    // Mirrors calculateInheritance's "places a grandchild by parentKindIndex,
    // not its physical parent array" test: after reassignment Kind 1's branch
    // is empty even though the raw data physically sits under it.
    const result = collectMissingChildrenNames([
      {
        name: "Kind 1",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [{ name: "Enkel", isAlive: "yes", parentKindIndex: "1" }],
      },
      { name: "Kind 2", isAlive: "no", hatteKinder: "yes" },
    ]);

    expect(result).toEqual(["Kind 1"]);
  });

  it("does not flag Kind 2 once a physically-elsewhere grandchild is reassigned to it", () => {
    const result = collectMissingChildrenNames([
      {
        name: "Kind 1",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [
          { name: "Enkel A", isAlive: "yes", parentKindIndex: "0" },
          { name: "Enkel B", isAlive: "yes", parentKindIndex: "1" },
        ],
      },
      { name: "Kind 2", isAlive: "no", hatteKinder: "yes" },
    ]);

    expect(result).toEqual([]);
  });

  it("returns the name of a dead person who stated they had kids but added none", () => {
    const result = collectMissingChildrenNames([
      { name: "Kind 1", isAlive: "no", hatteKinder: "yes", kinder: [] },
    ]);

    expect(result).toEqual(["Kind 1"]);
  });

  it("returns the name when kinder is missing entirely", () => {
    const result = collectMissingChildrenNames([
      { name: "Kind 1", isAlive: "no", hatteKinder: "yes" },
    ]);

    expect(result).toEqual(["Kind 1"]);
  });

  it("does not flag a living person", () => {
    const result = collectMissingChildrenNames([
      { name: "Kind 1", isAlive: "yes" },
    ]);

    expect(result).toEqual([]);
  });

  it("does not flag a dead person who stated no kids", () => {
    const result = collectMissingChildrenNames([
      { name: "Kind 1", isAlive: "no", hatteKinder: "no" },
    ]);

    expect(result).toEqual([]);
  });

  it("does not flag a dead person whose kinder were actually filled in", () => {
    const result = collectMissingChildrenNames([
      {
        name: "Kind 1",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [{ name: "Enkel", isAlive: "yes" }],
      },
    ]);

    expect(result).toEqual([]);
  });

  it("finds a missing-children person nested several levels deep", () => {
    const result = collectMissingChildrenNames([
      {
        name: "Kind 1",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [
          {
            name: "Enkel 1",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [],
          },
        ],
      },
    ]);

    expect(result).toEqual(["Enkel 1"]);
  });

  it("collects every affected person across multiple branches", () => {
    const result = collectMissingChildrenNames([
      { name: "Kind 1", isAlive: "no", hatteKinder: "yes", kinder: [] },
      { name: "Kind 2", isAlive: "yes" },
      { name: "Kind 3", isAlive: "no", hatteKinder: "yes" },
    ]);

    expect(result).toEqual(["Kind 1", "Kind 3"]);
  });
});

describe("collectMissingChildrenNamesForElternteile", () => {
  it("flags Elternteil A (not B) when a sibling is physically under A but reassigned to B via parentElternteilIndex", () => {
    // Mirrors calculateInheritance's "places a sibling by parentElternteilIndex,
    // not its physical parent array" test.
    const result = collectMissingChildrenNamesForElternteile([
      {
        name: "Elternteil A",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [
          {
            name: "Geschwister",
            isAlive: "yes",
            parentElternteilIndex: "1",
          },
        ],
      },
      { name: "Elternteil B", isAlive: "no", hatteKinder: "yes" },
    ]);

    expect(result).toEqual(["Elternteil A"]);
  });

  it("does not flag either parent when a sibling is assigned to 'both'", () => {
    const result = collectMissingChildrenNamesForElternteile([
      {
        name: "Elternteil A",
        isAlive: "no",
        hatteKinder: "yes",
        kinder: [
          {
            name: "Gemeinsames Kind",
            isAlive: "yes",
            parentElternteilIndex: "both",
          },
        ],
      },
      { name: "Elternteil B", isAlive: "no", hatteKinder: "yes" },
    ]);

    expect(result).toEqual([]);
  });

  it("recurses into a reassigned sibling's own kinder", () => {
    const result = collectMissingChildrenNamesForElternteile([
      {
        // hatteKinder "no" so A itself isn't flagged; the physical kinder
        // array still exists because that's just where the flow's shared
        // entry point happened to store the sibling.
        name: "Elternteil A",
        isAlive: "no",
        hatteKinder: "no",
        kinder: [
          {
            name: "Geschwister",
            isAlive: "no",
            hatteKinder: "yes",
            parentElternteilIndex: "1",
            kinder: [],
          },
        ],
      },
      { name: "Elternteil B", isAlive: "no", hatteKinder: "yes" },
    ]);

    expect(result).toEqual(["Geschwister"]);
  });
});
