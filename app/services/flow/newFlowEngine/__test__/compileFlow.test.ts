import { compileFlow } from "../compileFlow";
import z from "zod";

const pages = {
  start: { stepId: "/start" },
  info: { stepId: "/info", pageSchema: { name: z.string() } },
  typed: { stepId: "/typed", pageSchema: z.object({ age: z.number() }) },
  end: { stepId: "/end" },
} as const;

const transitions = {
  start: "info",
  info: "typed",
  typed: "end",
  end: null,
} as const;

const flow = compileFlow({ pages, initialStep: "start", transitions });

describe("compileFlow", () => {
  describe("path round-trip", () => {
    it("getNodeKeyFromPath(getPathFromNodeKey(key)) === key for all nodes", () => {
      for (const key of Object.keys(pages) as (keyof typeof pages)[]) {
        const path = flow.getPathFromNodeKey(key);
        expect(flow.getNodeKeyFromPath(path!)).toBe(key);
      }
    });

    it("getPathFromNodeKey returns undefined for undefined input", () => {
      expect(flow.getPathFromNodeKey(undefined)).toBeUndefined();
    });

    it("getNodeKeyFromPath returns undefined for an unknown path", () => {
      expect(flow.getNodeKeyFromPath("/unknown")).toBeUndefined();
    });
  });

  describe("schema", () => {
    it("ZodRawShape is compiled to a ZodObject", () => {
      const schema = flow.getSchema("/info");
      expect(schema).toBeInstanceOf(z.ZodObject);
    });

    it("ZodObject is passed through unchanged", () => {
      const schema = flow.getSchema("/typed");
      expect(schema).toBeInstanceOf(z.ZodObject);
    });

    it("pages without schema return an empty schema that parses {}", () => {
      const schema = flow.getSchema("/start");
      expect(schema?.parse({})).toEqual({});
    });

    it("returns undefined for an unknown path", () => {
      expect(flow.getSchema("/unknown")).toBeUndefined();
    });
  });

  describe("fieldNames", () => {
    it("extracts field names from ZodRawShape", () => {
      expect(flow.getFieldNames("/info")).toEqual(["name"]);
    });

    it("extracts field names from a ZodObject", () => {
      expect(flow.getFieldNames("/typed")).toEqual(["age"]);
    });

    it("returns empty array for pages without a schema", () => {
      expect(flow.getFieldNames("/start")).toEqual([]);
    });

    it("returns empty array for an unknown path", () => {
      expect(flow.getFieldNames("/unknown")).toEqual([]);
    });

    it("getFieldNamesByNodeKey returns field names by node key", () => {
      expect(flow.getFieldNamesByNodeKey("info")).toEqual(["name"]);
    });
  });

  describe("mandatory leading slash", () => {
    it("throws when a stepId does not start with /", () => {
      expect(() =>
        compileFlow({
          pages: { bad: { stepId: "no-slash" } } as const,
          initialStep: "bad",
          transitions: { bad: null },
        }),
      ).toThrow(/must start with "\//);
    });
  });

  describe("arrayInfo", () => {
    const arrayPages = {
      list: {
        stepId: "/list",
        arraySummary: {
          name: "items",
          schema: z.array(z.string()),
        },
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

    it("returns undefined for non-array pages", () => {
      expect(flow.getArrayInfo("/start")).toBeUndefined();
    });

    it("returns the array name from arraySummary", () => {
      expect(arrayFlow.getArrayInfo("/list")?.name).toBe("items");
    });

    it("returns the entryPoint derived from the addArrayItem target stepId", () => {
      // stepId "/items/#/daten" → entryPoint is last segment after "#" → "daten"
      expect(arrayFlow.getArrayInfo("/list")?.entryPoint).toBe("daten");
    });

    it("returns undefined for unknown path", () => {
      expect(arrayFlow.getArrayInfo("/unknown")).toBeUndefined();
    });
  });

  describe("isFinal", () => {
    it("is false for non-terminal steps", () => {
      expect(flow.isFinal("/start")).toBe(false);
    });

    it("is true for the terminal step", () => {
      expect(flow.isFinal("/end")).toBe(true);
    });

    it("returns undefined for an unknown path", () => {
      expect(flow.isFinal("/unknown")).toBeUndefined();
    });
  });

  describe("getProgress", () => {
    it("terminal step has progress equal to max", () => {
      const result = flow.getProgress("/end");
      expect(result?.progress).toBe(result?.max);
    });

    it("initial step has progress less than max", () => {
      const result = flow.getProgress("/start");
      expect(result?.progress).toBeLessThan(result!.max);
    });

    it("returns undefined for an unknown path", () => {
      expect(flow.getProgress("/unknown")).toBeUndefined();
    });
  });
});
