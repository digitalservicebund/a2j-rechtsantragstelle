import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { nachlassErbfolgeStaticFlow } from "../flowConfig";

type UserData = Parameters<typeof createFlowSession>[1];

const baseUserData = {
  hatteKinder: "no",
  elternteile: [],
  pageData: { arrayIndexes: [] },
};

describe("grosseltern question (spouse + no 1st/2nd order heirs)", () => {
  it("is shown when a spouse exists and no 1st/2nd order heirs were found", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      { ...baseUserData, ehepartnerName: "Partner" } as UserData,
      "/elternteile",
    );

    expect(session.nextPath).toBe("/grosseltern");
  });

  it("is skipped (goes straight to nichtErmitteltWeitereOrdnungen) without a spouse", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      baseUserData as UserData,
      "/elternteile",
    );

    expect(session.nextPath).toBe(
      "/ergebnis/erbfolge-nicht-ermittelt-weitere-ordnungen",
    );
  });

  it("routes to the further-orders exit page when grandparents are alive", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        ...baseUserData,
        ehepartnerName: "Partner",
        grosselternLeben: "yes",
      } as UserData,
      "/grosseltern",
    );

    expect(session.nextPath).toBe(
      "/ergebnis/erbfolge-nicht-ermittelt-weitere-ordnungen",
    );
  });

  it("routes to the result page when no grandparents are alive", () => {
    const session = createFlowSession(
      nachlassErbfolgeStaticFlow,
      {
        ...baseUserData,
        ehepartnerName: "Partner",
        grosselternLeben: "no",
      } as UserData,
      "/grosseltern",
    );

    expect(session.nextPath).toBe("/ergebnis/erbfolge");
  });
});
