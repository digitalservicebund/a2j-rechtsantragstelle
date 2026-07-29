import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { nachlassErbfolgeStaticFlow } from "../flowConfig";

type UserData = Parameters<typeof createFlowSession>[1];

describe("erbfolge Back navigation from array-summary pages", () => {
  it("skips back to the previous question from kind1Summary after one kind was filled in", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "yes",
        kinder: [{ name: "Kind 1", isAlive: "yes" }],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    expect(session.prevPath).toBe("/hatteKinder");
  });

  it("skips back to the previous question from kind1Summary through a nested grandchild cycle", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "yes",
        kinder: [
          {
            name: "Kind 1",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [{ name: "Enkel", isAlive: "yes" }],
          },
        ],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    expect(session.prevPath).toBe("/hatteKinder");
  });

  it("skips back to the hatteKinder question from elternteilSummary when reached with no kids", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "no",
        elternteile: [{ name: "Elternteil A", isAlive: "yes" }],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/elternteile",
    );

    expect(session.prevPath).toBe("/hatteKinder");
  });

  it("skips back to kind1Summary from elternteilSummary when reached via the kinder branch (all kids dead)", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "yes",
        kinder: [{ name: "Kind 1", isAlive: "no", hatteKinder: "no" }],
        elternteile: [{ name: "Elternteil A", isAlive: "yes" }],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/elternteile",
    );

    expect(session.prevPath).toBe("/kinder");
  });
});
