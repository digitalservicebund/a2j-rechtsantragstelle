import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { nachlassErbfolgeStaticFlow } from "../flowConfig";

type UserData = Parameters<typeof createFlowSession>[1];

describe("erbfolge Back navigation across array-summary cycles", () => {
  it("resolves a concrete prevPath from kind1Summary after one kind was filled in", () => {
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

    expect(session.prevPath).toBe("/kinder/0/daten");
  });

  it("resolves a concrete prevPath from kind1Summary through a nested grandchild cycle", () => {
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

    expect(session.prevPath).toBe("/kinder/0/daten");
  });

  it("resolves a concrete prevPath from elternteilSummary after one Elternteil was filled in", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        hatteKinder: "no",
        elternteile: [{ name: "Elternteil A", isAlive: "yes" }],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/elternteile",
    );

    expect(session.prevPath).toBe("/elternteile/0/daten");
  });
});
