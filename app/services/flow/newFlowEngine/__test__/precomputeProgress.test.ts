import { precomputeProgress } from "../precomputeProgress";

describe("precomputeGraph", () => {
  describe("linear flow", () => {
    const router = { a: "b", b: "c", c: null } as const;
    const graph = precomputeProgress(router, "a");

    it("initial node has progress less than max", () => {
      const { progress, max } = graph.getProgress("a");
      expect(progress).toBeLessThan(max);
    });

    it("nodes have increasing progress along the path", () => {
      const progressA = graph.getProgress("a").progress;
      const progressB = graph.getProgress("b").progress;
      const progressC = graph.getProgress("c").progress;
      expect(progressB).toBeGreaterThan(progressA);
      expect(progressC).toBeGreaterThan(progressB);
    });

    it("terminal node returns progress === max", () => {
      const { progress, max } = graph.getProgress("c");
      expect(progress).toBe(max);
    });

    it("max is always 100", () => {
      expect(graph.getProgress("a").max).toBe(100);
      expect(graph.getProgress("b").max).toBe(100);
      expect(graph.getProgress("c").max).toBe(100);
    });

    it("isFinal is true for the terminal node", () => {
      expect(graph.isFinal("c")).toBe(true);
    });

    it("isFinal is false for non-terminal nodes", () => {
      expect(graph.isFinal("a")).toBe(false);
      expect(graph.isFinal("b")).toBe(false);
    });
  });

  describe("branching flow", () => {
    const router = {
      start: [{ target: "left" as const }, { target: "right" as const }],
      left: null,
      right: null,
    };
    const graph = precomputeProgress(router, "start");

    it("sibling branch nodes get the same depth", () => {
      expect(graph.getProgress("left").progress).toBe(
        graph.getProgress("right").progress,
      );
    });

    it("branch nodes have higher progress than their parent", () => {
      expect(graph.getProgress("left").progress).toBeGreaterThan(
        graph.getProgress("start").progress,
      );
    });
  });

  describe("array item locking", () => {
    const router = {
      list: [
        { target: "item" as const, type: "addArrayItem" as const },
        { target: "done" as const },
      ],
      item: "done" as const,
      done: null,
    };
    const graph = precomputeProgress(router, "list");

    it("array item node gets the same depth as its parent list node", () => {
      expect(graph.getProgress("item").progress).toBe(
        graph.getProgress("list").progress,
      );
    });

    it("done node has greater depth than list node", () => {
      expect(graph.getProgress("done").progress).toBeGreaterThan(
        graph.getProgress("list").progress,
      );
    });
  });

  describe("single-node flow", () => {
    const router = { only: null } as const;
    const graph = precomputeProgress(router, "only");

    it("returns max progress for the sole node", () => {
      const { progress, max } = graph.getProgress("only");
      expect(progress).toBe(max);
    });

    it("isFinal is true for the sole node", () => {
      expect(graph.isFinal("only")).toBe(true);
    });
  });

  describe("progress normalization", () => {
    it("non-final nodes have progress at most 99", () => {
      const router = { a: "b", b: null } as const;
      const graph = precomputeProgress(router, "a");
      expect(graph.getProgress("a").progress).toBeLessThanOrEqual(99);
    });
  });
});
