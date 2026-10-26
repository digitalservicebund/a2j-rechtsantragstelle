import { type createFlowSession } from "../../flowEngine/createFlowSession";
import { flowDestination } from "../flowDestination";

const INITIAL_PAGE_FLOW = "/initial-step";

type ArrayInfo = ReturnType<
  ReturnType<typeof createFlowSession>["getArrayInfoByPath"]
>;

const getMockFlowEngineSession = (nextPath?: string, arrayInfo?: ArrayInfo) => {
  return {
    nextPath,
    initialPath: INITIAL_PAGE_FLOW,
    getArrayInfoByPath: () => arrayInfo,
  } as unknown as ReturnType<typeof createFlowSession>;
};

describe("flowDestination", () => {
  it.each([
    ["klagende", "klagenden"],
    ["beklagte", "beklagten"],
  ])(
    "returns the %s party edit anchor after submitting party or representative data",
    (relationship, arrayName) => {
      const overview = `/${relationship}-partei/${arrayName}/uebersicht`;
      const mockFlowEngineSession = getMockFlowEngineSession(overview, {
        name: arrayName,
      } as ArrayInfo);

      for (const dataPage of [
        "natuerliche-person-daten",
        "organisation-daten",
        "gesetzliche-vertretung/2/daten",
        "gesetzliche-vertretung/2/daten-organisation",
      ]) {
        const actual = flowDestination(
          `/geld-einklagen/anwaltschaft/${relationship}-partei/${arrayName}/1/${dataPage}`,
          mockFlowEngineSession,
        );

        expect(actual).toBe(
          `/geld-einklagen/anwaltschaft${overview}#array-summary-item-edit-${arrayName}-1`,
        );
      }
    },
  );

  it("should return the next step in case it does not have an array", () => {
    const mockFlowEngineSession = getMockFlowEngineSession("/next-step");

    const actual = flowDestination(
      "/beratungshilfe/antrag/some-path",
      mockFlowEngineSession,
    );

    expect(actual).toBe("/beratungshilfe/antrag/next-step");
  });

  it("should return the initial step in case it does not have an array and next step", () => {
    const mockFlowEngineSession = getMockFlowEngineSession();

    const actual = flowDestination(
      "/beratungshilfe/antrag/some-path",
      mockFlowEngineSession,
    );

    expect(actual).toBe("/beratungshilfe/antrag/initial-step");
  });

  it("should return the array next-step if the pathname contains an array", () => {
    const mockFlowEngineSession = getMockFlowEngineSession(
      "/finanzielle-angaben/kinder/kinder/#/address",
    );

    const actual = flowDestination(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/name",
      mockFlowEngineSession,
    );

    expect(actual).toBe(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/address",
    );
  });

  it("should return the next step with the array edit anchor if the pathname contains an array info and the next step has an array", () => {
    const mockFlowEngineSession = getMockFlowEngineSession(
      "/finanzielle-angaben/kinder/uebersicht",
      { name: "kinder" } as ArrayInfo,
    );

    const actual = flowDestination(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/name",
      mockFlowEngineSession,
    );

    expect(actual).toBe(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht#array-summary-item-edit-kinder-4",
    );
  });
});
