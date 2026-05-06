import z from "zod";
import { compileFlow } from "../compileFlow";
import { simulate, buildStatusTree, createEdgeTracker } from "../simulate";

const noData = { pageData: { arrayIndexes: [] } };

describe("simulate", () => {
  describe("linear flow", () => {
    const router = { a: "b", b: "c", c: null } as const;

    it("returns the full linear path in order", () => {
      const { path } = simulate(router, "a", noData);
      expect(path).toEqual(["a", "b", "c"]);
    });

    it("terminates successfully when it reaches a null transition", () => {
      const { isTerminatedSuccessfully } = simulate(router, "a", noData);
      expect(isTerminatedSuccessfully).toBe(true);
    });
  });

  describe("guarded transitions", () => {
    const flow = compileFlow({
      pages: {
        start: { stepId: "/start", pageSchema: { flag: z.boolean().optional() } },
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
      const { isTerminatedSuccessfully } = simulate(
        blockedFlow.transitions,
        blockedFlow.initialStep,
        noData,
      );
      expect(isTerminatedSuccessfully).toBe(false);
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
          start: { stepId: "/start", pageSchema: { go: z.boolean().optional() } },
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
    const flow = compileFlow({
      pages: { start: { stepId: "/start" } },
      initialStep: "start",
      transitions: { start: null },
    });

    it("single-segment stepId produces a top-level tree entry", () => {
      const sim = simulate(flow.transitions, flow.initialStep, noData);
      const tree = buildStatusTree(flow.pages, sim);
      expect(tree).toHaveProperty("/start");
    });

    it("flat path entry has isReachable true", () => {
      const sim = simulate(flow.transitions, flow.initialStep, noData);
      const tree = buildStatusTree(flow.pages, sim);
      expect(tree["/start"].isReachable).toBe(true);
    });

    it("flat path entry has isDone true when flow terminates", () => {
      const sim = simulate(flow.transitions, flow.initialStep, noData);
      const tree = buildStatusTree(flow.pages, sim);
      expect(tree["/start"].isDone).toBe(true);
    });
  });

  describe("two-level nested paths", () => {
    const flow = compileFlow({
      pages: {
        name: { stepId: "/personal/name" },
        addr: { stepId: "/personal/address" },
      },
      initialStep: "name",
      transitions: { name: "addr", addr: null },
    });

    it("creates a section entry at the first segment", () => {
      const sim = simulate(flow.transitions, flow.initialStep, noData);
      const tree = buildStatusTree(flow.pages, sim);
      expect(tree).toHaveProperty("/personal");
    });

    it("section isDone is true when the flow has terminated inside it", () => {
      const sim = simulate(flow.transitions, flow.initialStep, noData);
      const tree = buildStatusTree(flow.pages, sim);
      expect(tree["/personal"].isDone).toBe(true);
    });

    it("section isReachable is true when any node in it is reachable", () => {
      const sim = simulate(flow.transitions, flow.initialStep, noData);
      const tree = buildStatusTree(flow.pages, sim);
      expect(tree["/personal"].isReachable).toBe(true);
    });

    it("section isDone is false when flow has not yet entered it", () => {
      const earlyFlow = compileFlow({
        pages: {
          pre: { stepId: "/pre" },
          name: { stepId: "/personal/name" },
        },
        initialStep: "pre",
        transitions: {
          pre: [{ target: "name", guard: () => false }],
          name: null,
        },
      });
      const sim = simulate(earlyFlow.transitions, earlyFlow.initialStep, noData);
      const tree = buildStatusTree(earlyFlow.pages, sim);
      expect(tree["/personal"]?.isDone).toBe(false);
    });
  });

  describe("three-level nesting", () => {
    const flow = compileFlow({
      pages: { deep: { stepId: "/a/b/c" } },
      initialStep: "deep",
      transitions: { deep: null },
    });

    it("creates a parent section and a nested child section", () => {
      const sim = simulate(flow.transitions, flow.initialStep, noData);
      const tree = buildStatusTree(flow.pages, sim);
      expect(tree).toHaveProperty("/a");
      expect(tree["/a"].children).toHaveProperty("/b");
    });
  });

  describe("isReachable reflects the BFS reachableSet", () => {
    it("isReachable is false for sections not reached by BFS", () => {
      const flow = compileFlow({
        pages: {
          start: { stepId: "/start" },
          other: { stepId: "/other" },
        },
        initialStep: "start",
        // "other" is not reachable from "start"
        transitions: { start: null, other: null },
      });
      const sim = simulate(flow.transitions, flow.initialStep, noData);
      const tree = buildStatusTree(flow.pages, sim);
      expect(tree["/other"]?.isReachable).toBe(false);
    });
  });
});

describe("createEdgeTracker", () => {
  it("has returns false for a non-existent edge", () => {
    const tracker = createEdgeTracker<string>();
    expect(tracker.has("a", "b")).toBe(false);
  });

  it("has returns true after adding an edge", () => {
    const tracker = createEdgeTracker<string>();
    tracker.add("a", "b");
    expect(tracker.has("a", "b")).toBe(true);
  });

  it("edges are directional", () => {
    const tracker = createEdgeTracker<string>();
    tracker.add("a", "b");
    expect(tracker.has("b", "a")).toBe(false);
  });

  it("tracks multiple edges from the same node independently", () => {
    const tracker = createEdgeTracker<string>();
    tracker.add("a", "b");
    tracker.add("a", "c");
    expect(tracker.has("a", "b")).toBe(true);
    expect(tracker.has("a", "c")).toBe(true);
    expect(tracker.has("a", "d")).toBe(false);
  });
});
