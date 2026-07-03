import { buildStatusTree } from "../statusTree";

describe("buildStatusTree", () => {
  describe("flat paths (single segment)", () => {
    const pages = { start: { stepId: "/start" } };

    it("single-segment stepId produces a top-level tree entry", () => {
      const tree = buildStatusTree(
        pages,
        {
          keys: ["start"],
          reachableSet: new Set(["start"]),
          isComplete: true,
        },
        new Set(["start"]),
      );
      expect(tree).toHaveProperty("/start");
    });

    it("flat keys entry has isReachable true", () => {
      const tree = buildStatusTree(
        pages,
        {
          keys: ["start"],
          reachableSet: new Set(["start"]),
          isComplete: true,
        },
        new Set(["start"]),
      );
      expect(tree["/start"].isReachable).toBe(true);
    });

    it("flat keys entry has isDone true when node is in doneNodeKeys", () => {
      const tree = buildStatusTree(
        pages,
        {
          keys: ["start"],
          reachableSet: new Set(["start"]),
          isComplete: true,
        },
        new Set(["start"]),
      );
      expect(tree["/start"].isDone).toBe(true);
    });

    it("flat keys entry has isDone false when node is NOT in doneNodeKeys", () => {
      const tree = buildStatusTree(
        pages,
        {
          keys: ["start"],
          reachableSet: new Set(["start"]),
          isComplete: true,
        },
        new Set(),
      );
      expect(tree["/start"].isDone).toBe(false);
    });
  });

  describe("two-level nested paths", () => {
    const pages = {
      name: { stepId: "/personal/name" },
      addr: { stepId: "/personal/address" },
    };
    const sim = {
      keys: ["name", "addr"],
      reachableSet: new Set(["name", "addr"]),
      isComplete: true,
    };

    it("creates a section entry at the first segment", () => {
      expect(
        buildStatusTree(pages, sim, new Set(["name", "addr"])),
      ).toHaveProperty("/personal");
    });

    it("section isDone is true when all reachable nodes have their data filled", () => {
      expect(
        buildStatusTree(pages, sim, new Set(["name", "addr"]))["/personal"]
          .isDone,
      ).toBe(true);
    });

    it("section isDone is false when any reachable node has missing data", () => {
      expect(
        buildStatusTree(pages, sim, new Set(["name"]))["/personal"].isDone,
      ).toBe(false);
    });

    it("section isReachable is true when any node in it is reachable", () => {
      expect(
        buildStatusTree(pages, sim, new Set())["/personal"].isReachable,
      ).toBe(true);
    });

    it("section isDone is false when no nodes in it have been visited", () => {
      const tree = buildStatusTree(
        pages,
        {
          keys: ["pre"],
          reachableSet: new Set(["pre"]),
          isComplete: false,
        },
        new Set(),
      );
      expect(tree["/personal"]?.isDone).toBe(false);
    });
  });

  describe("three-level nesting", () => {
    it("creates a parent section and a nested child section", () => {
      const tree = buildStatusTree(
        { deep: { stepId: "/a/b/c" } },
        {
          keys: ["deep"],
          reachableSet: new Set(["deep"]),
          isComplete: true,
        },
        new Set(["deep"]),
      );
      expect(tree).toHaveProperty("/a");
      expect(tree["/a"].children).toHaveProperty("/b");
    });
  });

  describe("isReachable reflects the BFS reachableSet", () => {
    it("isReachable is false for sections not reached by BFS", () => {
      const pages = {
        start: { stepId: "/start" },
        other: { stepId: "/other" },
      };
      // "other" not in reachableSet
      const tree = buildStatusTree(
        pages,
        {
          keys: ["start"],
          reachableSet: new Set(["start"]),
          isComplete: true,
        },
        new Set(["start"]),
      );
      expect(tree["/other"]?.isReachable).toBe(false);
    });
  });
});
