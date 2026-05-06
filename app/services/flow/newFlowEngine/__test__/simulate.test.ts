import z from "zod";
import { compileFlow } from "../compileFlow";
import { simulate, buildStatusTree } from "../simulate";

const noData = { pageData: { arrayIndexes: [] } };

describe("simulate", () => {
  describe("linear flow", () => {
    const router = { a: "b", b: "c", c: null } as const;

    it("returns the full linear path in order", () => {
      const { path } = simulate(router, "a", noData);
      expect(path).toEqual(["a", "b", "c"]);
    });

    it("terminates successfully when it reaches a null transition", () => {
      const { isComplete } = simulate(router, "a", noData);
      expect(isComplete).toBe(true);
    });
  });

  describe("guarded transitions", () => {
    const flow = compileFlow({
      pages: {
        start: {
          stepId: "/start",
          pageSchema: { flag: z.boolean().optional() },
        },
        "yes-path": { stepId: "/yes-path" },
        "no-path": { stepId: "/no-path" },
      },
      initialStep: "start",
      transitions: {
        start: [
          { target: "yes-path", guard: (d) => d.flag === true },
          { target: "no-path" },
        ],
        "yes-path": null,
        "no-path": null,
      },
    });

    it("follows the passing guard branch", () => {
      const { path } = simulate(flow.transitions, flow.initialStep, {
        flag: true,
        pageData: { arrayIndexes: [] },
      });
      expect(path).toEqual(["start", "yes-path"]);
    });

    it("follows the fallback when the guard fails", () => {
      const { path } = simulate(flow.transitions, flow.initialStep, {
        flag: false,
        pageData: { arrayIndexes: [] },
      });
      expect(path).toEqual(["start", "no-path"]);
    });

    it("does not terminate successfully when all guards fail", () => {
      const blockedFlow = compileFlow({
        pages: {
          start: { stepId: "/start" },
          next: { stepId: "/next" },
        },
        initialStep: "start",
        transitions: {
          start: [{ target: "next", guard: () => false }],
          next: null,
        },
      });
      const { isComplete } = simulate(
        blockedFlow.transitions,
        blockedFlow.initialStep,
        noData,
      );
      expect(isComplete).toBe(false);
    });
  });

  describe("cycle safety", () => {
    it("does not loop infinitely on a cycle", () => {
      const router = { a: "b", b: "a" } as const;
      expect(() => simulate(router, "a", noData)).not.toThrow();
    });
  });

  describe("BFS reachableSet", () => {
    it("includes all nodes reachable under any guard outcome", () => {
      const flow = compileFlow({
        pages: {
          start: {
            stepId: "/start",
            pageSchema: { go: z.boolean().optional() },
          },
          conditional: { stepId: "/conditional" },
          always: { stepId: "/always" },
        },
        initialStep: "start",
        transitions: {
          start: [
            { target: "conditional", guard: (d) => d.go === true },
            { target: "always" },
          ],
          conditional: null,
          always: null,
        },
      });
      // Data only activates one branch, but BFS should include both
      const { reachableSet } = simulate(flow.transitions, flow.initialStep, {
        go: true,
        pageData: { arrayIndexes: [] },
      });
      expect(reachableSet.has("start")).toBe(true);
      expect(reachableSet.has("conditional")).toBe(true);
      expect(reachableSet.has("always")).toBe(true);
    });

    it("excludes nodes guarded by always-false guards", () => {
      const router = {
        start: [
          { target: "blocked" as const, guard: () => false },
          { target: "reachable" as const },
        ],
        blocked: null,
        reachable: null,
      };
      const { reachableSet } = simulate(router, "start", noData);
      expect(reachableSet.has("reachable")).toBe(true);
      expect(reachableSet.has("blocked")).toBe(false);
    });
  });

  describe("parentMap", () => {
    const router = { a: "b", b: "c", c: null } as const;

    it("maps each non-initial node to its BFS parent", () => {
      const { parentMap } = simulate(router, "a", noData);
      expect(parentMap.get("b")).toBe("a");
      expect(parentMap.get("c")).toBe("b");
    });

    it("initial node has no entry in parentMap", () => {
      const { parentMap } = simulate(router, "a", noData);
      expect(parentMap.has("a")).toBe(false);
    });
  });
});

describe("buildStatusTree", () => {
  describe("flat paths (single segment)", () => {
    const pages = { start: { stepId: "/start" } };

    it("single-segment stepId produces a top-level tree entry", () => {
      const tree = buildStatusTree(pages, {
        path: ["start"],
        reachableSet: new Set(["start"]),
        isComplete: true,
      });
      expect(tree).toHaveProperty("/start");
    });

    it("flat path entry has isReachable true", () => {
      const tree = buildStatusTree(pages, {
        path: ["start"],
        reachableSet: new Set(["start"]),
        isComplete: true,
      });
      expect(tree["/start"].isReachable).toBe(true);
    });

    it("flat path entry has isDone true when flow terminates", () => {
      const tree = buildStatusTree(pages, {
        path: ["start"],
        reachableSet: new Set(["start"]),
        isComplete: true,
      });
      expect(tree["/start"].isDone).toBe(true);
    });
  });

  describe("two-level nested paths", () => {
    const pages = {
      name: { stepId: "/personal/name" },
      addr: { stepId: "/personal/address" },
    };
    const sim = {
      path: ["name", "addr"],
      reachableSet: new Set(["name", "addr"]),
      isComplete: true,
    };

    it("creates a section entry at the first segment", () => {
      expect(buildStatusTree(pages, sim)).toHaveProperty("/personal");
    });

    it("section isDone is true when the flow has terminated inside it", () => {
      expect(buildStatusTree(pages, sim)["/personal"].isDone).toBe(true);
    });

    it("section isReachable is true when any node in it is reachable", () => {
      expect(buildStatusTree(pages, sim)["/personal"].isReachable).toBe(true);
    });

    it("section isDone is false when no nodes in it have been visited", () => {
      // path only visited "pre"; the /personal section was never entered
      const tree = buildStatusTree(pages, {
        path: ["pre"],
        reachableSet: new Set(["pre"]),
        isComplete: false,
      });
      expect(tree["/personal"]?.isDone).toBe(false);
    });
  });

  describe("three-level nesting", () => {
    it("creates a parent section and a nested child section", () => {
      const tree = buildStatusTree(
        { deep: { stepId: "/a/b/c" } },
        {
          path: ["deep"],
          reachableSet: new Set(["deep"]),
          isComplete: true,
        },
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
      const tree = buildStatusTree(pages, {
        path: ["start"],
        reachableSet: new Set(["start"]),
        isComplete: true,
      });
      expect(tree["/other"]?.isReachable).toBe(false);
    });
  });
});
