import { type createFlowSession } from "../../newFlowEngine/createFlowSession";
import { flowDestinationNewEngine } from "../flowDestinationNewEngine";

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

describe("flowDestinationNewEngine", () => {
  it("should return the next step in case it does not have an array", () => {
    const mockFlowEngineSession = getMockFlowEngineSession("/next-step");

    const actual = flowDestinationNewEngine(
      "/beratungshilfe/antrag/some-path",
      mockFlowEngineSession,
    );

    expect(actual).toBe("/beratungshilfe/antrag/next-step");
  });

  it("should return the initial step in case it does not have an array and next step", () => {
    const mockFlowEngineSession = getMockFlowEngineSession();

    const actual = flowDestinationNewEngine(
      "/beratungshilfe/antrag/some-path",
      mockFlowEngineSession,
    );

    expect(actual).toBe("/beratungshilfe/antrag/initial-step");
  });

  it("should return the array next-step if the pathname contains an array", () => {
    const mockFlowEngineSession = getMockFlowEngineSession(
      "/finanzielle-angaben/kinder/kinder/#/address",
    );

    const actual = flowDestinationNewEngine(
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

    const actual = flowDestinationNewEngine(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/kinder/4/name",
      mockFlowEngineSession,
    );

    expect(actual).toBe(
      "/beratungshilfe/antrag/finanzielle-angaben/kinder/uebersicht#array-summary-item-edit-kinder-4",
    );
  });
});
