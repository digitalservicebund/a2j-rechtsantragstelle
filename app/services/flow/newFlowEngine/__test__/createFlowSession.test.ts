import { createFlowSession } from "../createFlowSession";
import { compileFlow } from "../compileFlow";
import z from "zod";

const noData = { pageData: { arrayIndexes: [] } };

const pages = {
  start: { stepId: "/start" },
  middle: { stepId: "/middle", pageSchema: { answer: z.string() } },
  end: { stepId: "/end" },
} as const;

const transitions = {
  start: "middle",
  middle: "end",
  end: null,
} as const;

const flow = compileFlow({ pages, initialStep: "start", transitions });

describe("createFlowSession", () => {
  describe("invalid path", () => {
    it("throws an Error for an unknown path", () => {
      expect(() => createFlowSession(flow, noData, "/unknown")).toThrow(
        /Invalid path/,
      );
    });
  });

  describe("nodeKey", () => {
    it("returns the correct nodeKey for the current path", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.nodeKey).toBe("start");
    });

    it("returns the correct nodeKey for a non-initial step", () => {
      const session = createFlowSession(flow, noData, "/middle");
      expect(session.nodeKey).toBe("middle");
    });
  });

  describe("initialPath", () => {
    it("always returns the path of the initial step", () => {
      const session = createFlowSession(flow, noData, "/end");
      expect(session.initialPath).toBe("/start");
    });
  });

  describe("isTerminated", () => {
    it("is true when the simulation reaches a null transition", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.isTerminated).toBe(true);
    });

    it("is false when guards block all forward progress", () => {
      const blockedPages = {
        a: { stepId: "/a" },
        b: { stepId: "/b" },
      } as const;
      const blockedTransitions = {
        a: [{ target: "b" as const, guard: () => false }],
        b: null,
      };
      const blockedFlow = compileFlow({
        pages: blockedPages,
        initialStep: "a",
        transitions: blockedTransitions,
      });
      const session = createFlowSession(blockedFlow, noData, "/a");
      expect(session.isTerminated).toBe(false);
    });
  });

  describe("pageSchema", () => {
    it("returns a ZodObject for pages with a schema", () => {
      const session = createFlowSession(flow, noData, "/middle");
      expect(session.pageSchema).toBeInstanceOf(z.ZodObject);
    });

    it("returns an empty-object schema for pages without a schema", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.pageSchema?.parse({})).toEqual({});
    });
  });

  describe("fieldNames", () => {
    it("returns field names for pages with a schema", () => {
      const session = createFlowSession(flow, noData, "/middle");
      expect(session.fieldNames).toEqual(["answer"]);
    });

    it("returns an empty array for pages without a schema", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.fieldNames).toEqual([]);
    });
  });

  describe("getNextStep", () => {
    it("returns the next step path", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.getNextStep()).toBe("/middle");
    });

    it("returns undefined at the terminal step", () => {
      const session = createFlowSession(flow, noData, "/end");
      expect(session.getNextStep()).toBeUndefined();
    });

    it("skips addArrayItem transitions to return the next main-branch step", () => {
      const arrayPages = {
        list: {
          stepId: "/list",
          arraySummary: { name: "items", schema: z.array(z.string()) },
        },
        item: { stepId: "/items/#/daten" },
        done: { stepId: "/done" },
      } as const;
      const arrayTransitions = {
        list: [
          { target: "item" as const, type: "addArrayItem" as const },
          { target: "done" as const },
        ],
        item: "done" as const,
        done: null,
      };
      const arrayFlow = compileFlow({
        pages: arrayPages,
        initialStep: "list",
        transitions: arrayTransitions,
      });
      const session = createFlowSession(arrayFlow, noData, "/list");
      expect(session.getNextStep()).toBe("/done");
    });
  });

  describe("getPrevStep", () => {
    it("returns the previous step path via BFS parentMap", () => {
      const session = createFlowSession(flow, noData, "/middle");
      expect(session.getPrevStep()).toBe("/start");
    });

    it("returns undefined at the initial step", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.getPrevStep()).toBeUndefined();
    });
  });

  describe("isReachable", () => {
    it("returns true for paths reachable from the initial step", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.isReachable("/middle")).toBe(true);
      expect(session.isReachable("/end")).toBe(true);
    });

    it("returns false for an unknown path", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.isReachable("/nonexistent")).toBe(false);
    });

    it("returns false for a path blocked by always-false guards", () => {
      const branchedPages = {
        start: { stepId: "/start" },
        blocked: { stepId: "/blocked" },
        open: { stepId: "/open" },
      } as const;
      const branchedTransitions = {
        start: [
          { target: "blocked" as const, guard: () => false },
          { target: "open" as const },
        ],
        blocked: null,
        open: null,
      };
      const branchedFlow = compileFlow({
        pages: branchedPages,
        initialStep: "start",
        transitions: branchedTransitions,
      });
      const session = createFlowSession(branchedFlow, noData, "/start");
      expect(session.isReachable("/blocked")).toBe(false);
      expect(session.isReachable("/open")).toBe(true);
    });
  });

  describe("arrayInfo", () => {
    it("returns undefined for non-array pages", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.arrayInfo).toBeUndefined();
    });

    it("returns the array name and entryPoint for array summary pages", () => {
      const arrayPages = {
        list: {
          stepId: "/list",
          arraySummary: { name: "items", schema: z.array(z.string()) },
        },
        item: { stepId: "/items/#/daten" },
        done: { stepId: "/done" },
      } as const;
      const arrayTransitions = {
        list: [
          { target: "item" as const, type: "addArrayItem" as const },
          { target: "done" as const },
        ],
        item: "done" as const,
        done: null,
      };
      const arrayFlow = compileFlow({
        pages: arrayPages,
        initialStep: "list",
        transitions: arrayTransitions,
      });
      const session = createFlowSession(arrayFlow, noData, "/list");
      expect(session.arrayInfo?.name).toBe("items");
      expect(session.arrayInfo?.entryPoint).toBe("daten");
    });
  });

  describe("path", () => {
    it("contains the simulation path from initial to terminal step", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.path).toEqual(["start", "middle", "end"]);
    });
  });

  describe("statusTree", () => {
    it("is populated for flows with nested stepIds", () => {
      const nestedPages = {
        a: { stepId: "/section/a" },
        b: { stepId: "/section/b" },
      } as const;
      const nestedTransitions = { a: "b", b: null } as const;
      const nestedFlow = compileFlow({
        pages: nestedPages,
        initialStep: "a",
        transitions: nestedTransitions,
      });
      const session = createFlowSession(nestedFlow, noData, "/section/a");
      expect(session.statusTree).toHaveProperty("/section");
    });
  });
});
