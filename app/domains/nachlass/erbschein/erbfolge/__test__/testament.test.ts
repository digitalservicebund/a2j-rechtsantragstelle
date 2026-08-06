import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { nachlassErbfolgeStaticFlow } from "../flowConfig";

type UserData = Parameters<typeof createFlowSession>[1];

const EXIT_PATH = "/ergebnis/keine-gesetzliche-erbfolge";
const emptyPageData = { pageData: { arrayIndexes: [] } };

describe("testament / Erbvertrag entry question", () => {
  it("is the first question after the start page", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      emptyPageData as UserData,
      "/start",
    );

    expect(session.nextPath).toBe("/testamentOderErbvertrag");
  });

  it("continues into the flow when nothing exists", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      { ...emptyPageData, testamentArt: "none" } as UserData,
      "/testamentOderErbvertrag",
    );

    expect(session.nextPath).toBe("/verstorbenePerson");
  });

  it.each(["handwritten", "notarized", "erbvertrag"] as const)(
    "exits to the no-statutory-succession page for '%s'",
    (testamentArt) => {
      const session = createFlowSession(
        nachlassErbfolgeStaticFlow,
        { ...emptyPageData, testamentArt } as UserData,
        "/testamentOderErbvertrag",
      );

      expect(session.nextPath).toBe(EXIT_PATH);
    },
  );
});
