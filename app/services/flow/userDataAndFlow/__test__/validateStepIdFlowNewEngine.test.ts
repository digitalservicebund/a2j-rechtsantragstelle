import { type createFlowSession } from "../../newFlowEngine/createFlowSession";
import { validateStepIdFlowNewEngine } from "../validateStepIdFlowNewEngine";

const INITIAL_PAGE_FLOW = "/ergebnis/initial";

const mockURL = new URL(
  "http://example.com/fluggastrechte/formular?stepId=ergebnis/erfolg",
);

const getMockFlowEngineSession = (isReachable: boolean) => {
  return {
    isReachable: vi.fn().mockReturnValue(isReachable),
    initialPath: INITIAL_PAGE_FLOW,
  } as unknown as ReturnType<typeof createFlowSession>;
};

describe("validateStepIdFlowNewEngine", () => {
  it("should return an error and redirect to initial flow page in case the page is not reachable", () => {
    const mockFlowEngineSession = getMockFlowEngineSession(false);

    const result = validateStepIdFlowNewEngine(
      "/fluggastrechte/formular",
      "/",
      mockFlowEngineSession,
      mockURL,
    );

    expect(result.isErr).toBe(true);
    expect(result.isErr ? result.error.redirectTo : "").toBe(
      "/fluggastrechte/formular" + INITIAL_PAGE_FLOW,
    );
  });

  it("should return ok if the step ID flow is correct", async () => {
    const mockFlowEngineSession = getMockFlowEngineSession(true);

    const result = validateStepIdFlowNewEngine(
      "/fluggastrechte/formular",
      "/",
      mockFlowEngineSession,
      mockURL,
    );

    expect(result.isOk).toBe(true);
  });

  it("should return ok if in case the page is not reachable and the url contains skipFlowId in the search parameter", async () => {
    const mockFlowEngineSession = getMockFlowEngineSession(true);

    const mockURLWithSkipFlowId = new URL(
      "http://example.com/fluggastrechte/formular?stepId=ergebnis/erfolg&skipFlowId=true",
    );

    const result = validateStepIdFlowNewEngine(
      "/fluggastrechte/formular",
      "/",
      mockFlowEngineSession,
      mockURLWithSkipFlowId,
    );

    expect(result.isOk).toBe(true);
  });
});
