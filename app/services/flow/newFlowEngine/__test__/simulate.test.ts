import z from "zod";
import { compileFlow } from "../compileFlow";
import { runSimulation } from "~/services/flow/newFlowEngine/simulate";

const noData = { pageData: { arrayIndexes: [] } };

describe("runSimulation", () => {
  describe("linear flow", () => {
    const flow = compileFlow({
      pages: {
        a: { stepId: "/a" },
        b: { stepId: "/b" },
        c: { stepId: "/c" },
      },
      initialStep: "a",
      transitions: { a: "b", b: "c", c: null },
    });

    it("returns the full linear keys in order", () => {
      const { keys } = runSimulation(noData, flow);
      expect(keys).toEqual(["a", "b", "c"]);
    });

    it("terminates successfully when it reaches a null transition", () => {
      const { isComplete } = runSimulation(noData, flow);
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
      const { keys } = runSimulation(
        {
          flag: true,
          pageData: { arrayIndexes: [] },
        },
        flow,
      );
      expect(keys).toEqual(["start", "yes-path"]);
    });

    it("follows the fallback when the guard fails", () => {
      const { keys } = runSimulation(
        {
          flag: false,
          pageData: { arrayIndexes: [] },
        },
        flow,
      );
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
      const { isComplete } = runSimulation(noData, blockedFlow);
      expect(isComplete).toBe(false);
    });
  });

  describe("cycle safety", () => {
    it("does not loop infinitely on a cycle", () => {
      const flow = compileFlow({
        pages: {
          a: { stepId: "/a" },
          b: { stepId: "/b" },
        },
        initialStep: "a",
        transitions: { a: "b", b: "a" },
      });
      expect(() => runSimulation(noData, flow)).not.toThrow();
    });
  });

  describe("BFS reachableSet", () => {
    it("uses first-match-wins: matched guard blocks lower-priority branches", () => {
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
      // BFS is first-match-wins: guard passes → conditional reachable, always is not
      const { reachableSet } = runSimulation(
        {
          go: true,
          pageData: { arrayIndexes: [] },
        },
        flow,
      );
      expect(reachableSet.has("start")).toBe(true);
      expect(reachableSet.has("conditional")).toBe(true);
      expect(reachableSet.has("always")).toBe(false);
    });

    it("excludes nodes guarded by always-false guards", () => {
      const flow = compileFlow({
        pages: {
          start: { stepId: "/start" },
          blocked: { stepId: "/blocked" },
          reachable: { stepId: "/reachable" },
        },
        initialStep: "start",
        transitions: {
          start: [
            { target: "blocked" as const, guard: () => false },
            { target: "reachable" as const },
          ],
          blocked: null,
          reachable: null,
        },
      });
      const { reachableSet } = runSimulation(noData, flow);
      expect(reachableSet.has("reachable")).toBe(true);
      expect(reachableSet.has("blocked")).toBe(false);
    });
  });

  describe("parentMap", () => {
    const flow = compileFlow({
      pages: {
        a: { stepId: "/a" },
        b: { stepId: "/b" },
        c: { stepId: "/c" },
      },
      initialStep: "a",
      transitions: { a: "b", b: "c", c: null },
    });

    it("maps each non-initial node to its BFS parent", () => {
      const { parentMap } = runSimulation(noData, flow);
      expect(parentMap.get("b")).toBe("a");
      expect(parentMap.get("c")).toBe("b");
    });

    it("initial node has no entry in parentMap", () => {
      const { parentMap } = runSimulation(noData, flow);
      expect(parentMap.has("a")).toBe(false);
    });
  });
});
