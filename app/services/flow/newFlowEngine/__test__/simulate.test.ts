import z from "zod";
import { compileFlow } from "../compileFlow";
import { simulate } from "../simulate";

const noData = { pageData: { arrayIndexes: [] } };

describe("simulate", () => {
  describe("linear flow", () => {
    const router = { a: "b", b: "c", c: null } as const;

    it("returns the full linear keys in order", () => {
      const { keys } = simulate(router, "a", noData);
      expect(keys).toEqual(["a", "b", "c"]);
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
      const { keys } = simulate(flow.transitions, flow.initialStep, {
        flag: true,
        pageData: { arrayIndexes: [] },
      });
      expect(keys).toEqual(["start", "yes-path"]);
    });

    it("follows the fallback when the guard fails", () => {
      const { keys } = simulate(flow.transitions, flow.initialStep, {
        flag: false,
        pageData: { arrayIndexes: [] },
      });
      expect(keys).toEqual(["start", "no-path"]);
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
