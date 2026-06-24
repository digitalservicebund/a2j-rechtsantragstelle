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

  describe("isComplete", () => {
    it("is true when the simulation reaches a null transition", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.isComplete).toBe(true);
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
      expect(session.isComplete).toBe(false);
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

  describe("nextPath", () => {
    it("returns the next step path", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.nextPath).toBe("/middle");
    });

    it("returns undefined at the terminal step", () => {
      const session = createFlowSession(flow, noData, "/end");
      expect(session.nextPath).toBeUndefined();
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
      expect(session.nextPath).toBe("/done");
    });
  });

  describe("prevPath", () => {
    it("returns the previous step path via the linear breadcrumb", () => {
      const session = createFlowSession(flow, noData, "/middle");
      expect(session.prevPath).toBe("/start");
    });

    it("returns undefined at the initial step", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.prevPath).toBeUndefined();
    });

    it("retraces the linear path, not the BFS shortcut, when branches converge", () => {
      const convergingFlow = compileFlow({
        pages: {
          gegenWen: {
            stepId: "/gericht-pruefen/beklagte-person/gegen-wen",
            pageSchema: { gegenWenBeklagen: z.string() },
          },
          kaufmann: {
            stepId: "/gericht-pruefen/beklagte-person/kaufmann",
          },
          postleitzahl: {
            stepId:
              "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
          },
        },
        initialStep: "gegenWen",
        transitions: {
          gegenWen: [
            {
              target: "kaufmann" as const,
              guard: (ctx) => ctx.gegenWenBeklagen === "person",
            },
            { target: "postleitzahl" as const },
          ],
          kaufmann: "postleitzahl" as const,
          postleitzahl: null,
        },
      });
      const session = createFlowSession(
        convergingFlow,
        { gegenWenBeklagen: "person", pageData: { arrayIndexes: [] } },
        "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      );
      expect(session.prevPath).toBe(
        "/gericht-pruefen/beklagte-person/kaufmann",
      );
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

  describe("simulationKeys", () => {
    it("contains the simulation keys from initial to terminal step", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.simulationKeys).toEqual(["start", "middle", "end"]);
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

    it("marks a section isDone when all reachable pages have their schema fields filled", () => {
      const session = createFlowSession(
        flow,
        { answer: "hello", pageData: { arrayIndexes: [] } },
        "/start",
      );
      // "middle" has stepId "/middle" — 1-level path appears as top-level tree key
      expect(session.statusTree["/middle"]?.isDone).toBe(true);
    });

    it("marks a section isDone false when a reachable page has unfilled required fields", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.statusTree["/middle"]?.isDone).toBe(false);
    });

    it("marks info pages (no schema) as done regardless of user data", () => {
      const infoFlow = compileFlow({
        pages: {
          info: { stepId: "/section/info" },
          form: {
            stepId: "/section/form",
            pageSchema: { name: z.string().min(1) },
          },
        },
        initialStep: "info",
        transitions: { info: "form", form: null } as const,
      });
      const session = createFlowSession(infoFlow, noData, "/section/info");
      // "info" has no schema → always done; "form" has unfilled field → not done
      // section isDone requires ALL reachable pages to be done → false
      expect(session.statusTree["/section"]?.isDone).toBe(false);

      const filledSession = createFlowSession(
        infoFlow,
        { name: "Alice", pageData: { arrayIndexes: [] } },
        "/section/info",
      );
      expect(filledSession.statusTree["/section"]?.isDone).toBe(true);
    });

    it("section boundary guard: section becomes reachable after subflowDoneStates is set", () => {
      const gatedFlow = compileFlow({
        pages: {
          aPage: {
            stepId: "/section-a/page",
            pageSchema: { name: z.string().min(1) },
          },
          bPage: {
            stepId: "/section-b/page",
            pageSchema: { value: z.string().min(1) },
          },
        },
        initialStep: "aPage",
        transitions: {
          aPage: [
            {
              guard: (ctx) =>
                ctx.pageData?.subflowDoneStates?.["/section-a"] === true,
              target: "bPage" as const,
            },
          ],
          bPage: null,
        },
      });

      // Fields unfilled and no subflowDoneStates: section-b not reachable, section-a not done
      const emptySession = createFlowSession(
        gatedFlow,
        noData,
        "/section-a/page",
      );
      expect(emptySession.statusTree["/section-a"]?.isDone).toBe(false);
      expect(emptySession.statusTree["/section-b"]?.isReachable).toBe(false);

      // Fields filled but subflowDoneStates not yet set: section-a is done but section-b
      // still not reachable (guard hasn't fired yet — needs the persisted flag)
      const filledNoFlag = createFlowSession(
        gatedFlow,
        { name: "Alice", pageData: { arrayIndexes: [] } },
        "/section-a/page",
      );
      expect(filledNoFlag.statusTree["/section-a"]?.isDone).toBe(true);
      expect(filledNoFlag.statusTree["/section-b"]?.isReachable).toBe(false);

      // After subflowDoneStates is persisted (e.g. by saveUserDataAndReturnEngineSession),
      // the guard passes and section-b becomes reachable
      const withFlag = createFlowSession(
        gatedFlow,
        {
          name: "Alice",
          pageData: {
            arrayIndexes: [],
            subflowDoneStates: { "/section-a": true },
          },
        },
        "/section-a/page",
      );
      expect(withFlag.statusTree["/section-a"]?.isDone).toBe(true);
      expect(withFlag.statusTree["/section-b"]?.isReachable).toBe(true);
      expect(withFlag.statusTree["/section-b"]?.isDone).toBe(false);
    });
  });

  describe("prunedUserData", () => {
    it("keeps fields belonging to reachable pages", () => {
      const session = createFlowSession(
        flow,
        { answer: "hello", pageData: { arrayIndexes: [] } },
        "/start",
      );
      expect(session.prunedUserData).toEqual({ answer: "hello" });
    });

    it("removes fields belonging to unreachable pages", () => {
      const guardedFlow = compileFlow({
        pages: {
          start: { stepId: "/start" },
          yes: { stepId: "/yes", pageSchema: { yesField: z.string() } },
          no: { stepId: "/no", pageSchema: { noField: z.string() } },
        },
        initialStep: "start",
        transitions: {
          start: [
            { target: "yes", guard: (d) => d.yesField === "y" },
            { target: "no" },
          ],
          yes: null,
          no: null,
        },
      });
      // Guard fails → "yes" is unreachable → yesField should be pruned
      const session = createFlowSession(
        guardedFlow,
        { yesField: "no", noField: "n", pageData: { arrayIndexes: [] } },
        "/start",
      );
      expect(session.prunedUserData).toEqual({ noField: "n" });
    });

    it("keeps the top-level array field when the array summary page is reachable", () => {
      const arrayFlow = compileFlow({
        pages: {
          list: {
            stepId: "/list",
            arraySummary: {
              name: "items",
              schema: z.array(z.object({ val: z.string() })),
            },
          },
          item: { stepId: "/items/#/daten", pageSchema: { val: z.string() } },
          done: { stepId: "/done" },
        },
        initialStep: "list",
        transitions: {
          list: [
            { target: "item" as const, type: "addArrayItem" as const },
            { target: "done" as const },
          ],
          item: "done" as const,
          done: null,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = createFlowSession(
        arrayFlow,
        { items: [{ val: "a" }], pageData: { arrayIndexes: [] } } as any,
        "/list",
      );
      expect(session.prunedUserData).toEqual({ items: [{ val: "a" }] });
    });

    it("prunes stale fields within each array item based on per-item BFS traversal", () => {
      // Each item asks isAdult first, then branches:
      //   isAdult=yes → name page
      //   isAdult=no  → birthday page
      // If an item previously had isAdult=yes+name, then the user changed to isAdult=no+birthday,
      // the name field should be pruned even though 'name' is reachable for other items.
      const arrayFlow = compileFlow({
        pages: {
          list: {
            stepId: "/list",
            arraySummary: {
              name: "people",
              schema: z.array(
                z.object({
                  isAdult: z.string(),
                  name: z.string().optional(),
                  birthday: z.string().optional(),
                }),
              ),
            },
          },
          adultCheck: {
            stepId: "/people/#/adult-check",
            pageSchema: { isAdult: z.string() },
          },
          namePage: {
            stepId: "/people/#/name",
            pageSchema: { name: z.string() },
          },
          birthdayPage: {
            stepId: "/people/#/birthday",
            pageSchema: { birthday: z.string() },
          },
          done: { stepId: "/done" },
        },
        initialStep: "list",
        transitions: {
          list: [
            { target: "adultCheck" as const, type: "addArrayItem" as const },
            { target: "done" as const },
          ],
          adultCheck: [
            {
              target: "namePage" as const,
              guard: (d) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (d as any).people?.[(d as any).pageData?.arrayIndexes?.[0]]
                  ?.isAdult === "yes",
            },
            { target: "birthdayPage" as const },
          ],
          namePage: "list" as const,
          birthdayPage: "list" as const,
          done: null,
        },
      });

      // item 0: adult (isAdult=yes) → name reachable, birthday unreachable
      // item 1: minor (isAdult=no) → birthday reachable, name unreachable
      // item 1 also has a stale 'name' from a previous answer that should be pruned
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = createFlowSession(
        arrayFlow,
        {
          people: [
            { isAdult: "yes", name: "Alice" },
            { isAdult: "no", birthday: "1990-01-01", name: "stale" },
          ],
          pageData: { arrayIndexes: [] },
        } as any,
        "/list",
      );

      expect(session.prunedUserData).toEqual({
        people: [
          { isAdult: "yes", name: "Alice" },
          { isAdult: "no", birthday: "1990-01-01" },
        ],
      });
    });

    it("does not include pageData in prunedUserData", () => {
      const session = createFlowSession(flow, noData, "/start");
      expect(session.prunedUserData).not.toHaveProperty("pageData");
    });

    it("keeps nested array data when the nested array name uses #-notation", () => {
      // Regression test: arraySummary.name like "parents#children" must use the
      // leaf segment ("children") as the scopeData key and arrayPath segment —
      // not the full #-notation string.
      const nestedHashFlow = compileFlow({
        pages: {
          parentList: {
            stepId: "/parents",
            arraySummary: {
              name: "parents",
              schema: z.array(z.object({ name: z.string() })),
            },
          },
          parentEntry: {
            stepId: "/parents/#/name",
            pageSchema: { "parents#name": z.string() },
          },
          childList: {
            stepId: "/parents/#/children",
            arraySummary: {
              name: "parents#children",
              schema: z.array(z.object({ name: z.string() })),
            },
          },
          childEntry: {
            stepId: "/parents/#/children/#/name",
            pageSchema: { "parents#children#name": z.string() },
          },
          done: { stepId: "/done" },
        },
        initialStep: "parentList",
        transitions: {
          parentList: [
            { target: "parentEntry" as const, type: "addArrayItem" as const },
            { target: "done" as const },
          ],
          parentEntry: "childList" as const,
          childList: [
            { target: "childEntry" as const, type: "addArrayItem" as const },
            { target: "parentList" as const },
          ],
          childEntry: "childList" as const,
          done: null,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = createFlowSession(
        nestedHashFlow,
        {
          parents: [{ name: "Alice", children: [{ name: "Bob" }] }],
          pageData: { arrayIndexes: [] },
        } as any,
        "/parents",
      );

      expect(session.prunedUserData).toEqual({
        parents: [{ name: "Alice", children: [{ name: "Bob" }] }],
      });
    });

    it("prunes stale fields in nested array items based on per-item traversal", () => {
      // Flow: childrenList → childEntry (name) → toyList → toyEntry (toyName + isFavorite)
      //       → toyColor (if isFavorite=yes) → toyList → childrenList → done
      // Toy 0: isFavorite=yes → color kept
      // Toy 1: isFavorite=no  → stale color pruned
      const nestedFlow = compileFlow({
        pages: {
          childrenList: {
            stepId: "/children",
            arraySummary: {
              name: "children",
              schema: z.array(z.object({ name: z.string() })),
            },
          },
          childEntry: {
            stepId: "/children/#/name",
            pageSchema: { name: z.string() },
          },
          toyList: {
            stepId: "/children/#/toys",
            arraySummary: {
              name: "toys",
              schema: z.array(z.object({ toyName: z.string() })),
            },
          },
          toyEntry: {
            stepId: "/children/#/toys/#/entry",
            pageSchema: { toyName: z.string(), isFavorite: z.string() },
          },
          toyColor: {
            stepId: "/children/#/toys/#/color",
            pageSchema: { color: z.string() },
          },
          done: { stepId: "/done" },
        },
        initialStep: "childrenList",
        transitions: {
          childrenList: [
            { target: "childEntry" as const, type: "addArrayItem" as const },
            { target: "done" as const },
          ],
          childEntry: "toyList" as const,
          toyList: [
            { target: "toyEntry" as const, type: "addArrayItem" as const },
            { target: "childrenList" as const },
          ],
          toyEntry: [
            {
              target: "toyColor" as const,
              guard: (d) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (d as any).children?.[(d as any).pageData?.arrayIndexes?.[0]]
                  ?.toys?.[(d as any).pageData?.arrayIndexes?.[1]]
                  ?.isFavorite === "yes",
            },
            { target: "toyList" as const },
          ],
          toyColor: "toyList" as const,
          done: null,
        },
      });

      // Child 0 "Alice" has two toys:
      //   toy 0: isFavorite=yes → color="red" is kept
      //   toy 1: isFavorite=no  → color="stale" should be pruned
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = createFlowSession(
        nestedFlow,
        {
          children: [
            {
              name: "Alice",
              toys: [
                { toyName: "Lego", isFavorite: "yes", color: "red" },
                { toyName: "Ball", isFavorite: "no", color: "stale" },
              ],
            },
          ],
          pageData: { arrayIndexes: [] },
        } as any,
        "/children",
      );

      expect(session.prunedUserData).toEqual({
        children: [
          {
            name: "Alice",
            toys: [
              { toyName: "Lego", isFavorite: "yes", color: "red" },
              { toyName: "Ball", isFavorite: "no" },
            ],
          },
        ],
      });
    });
  });
});
