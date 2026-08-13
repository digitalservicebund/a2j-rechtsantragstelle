import { type createFlowSession } from "../../newFlowEngine/createFlowSession";
import { validateStepIdFlowNewEngine } from "../validateStepIdFlowNewEngine";
import { type Flow } from "~/domains/flows.server";

const INITIAL_PAGE_FLOW = "/ergebnis/initial";

const mockFlow = {} as Flow;

const mockURLSearchParams = new URLSearchParams();

const getMockFlowEngineSession = (isReachable: boolean) => {
  return {
    isReachable: vi.fn().mockReturnValue(isReachable),
    initialPath: INITIAL_PAGE_FLOW,
  } as unknown as ReturnType<typeof createFlowSession>;
};

describe("validateStepIdFlowNewEngine", () => {
  it("should return an error and redirect to initial flow page in case the page is not reachable", async () => {
    const mockFlowEngineSession = getMockFlowEngineSession(false);

    const result = await validateStepIdFlowNewEngine(
      "/fluggastrechte/formular",
      "/",
      mockURLSearchParams,
      null,
      mockFlowEngineSession,
      mockFlow,
    );

    expect(result.isErr).toBe(true);
    expect(result.isErr ? result.error.redirectTo : "").toBe(
      "/fluggastrechte/formular" + INITIAL_PAGE_FLOW,
    );
  });

  it("should return ok if the step ID flow is correct", async () => {
    const mockFlowEngineSession = getMockFlowEngineSession(true);

    const result = await validateStepIdFlowNewEngine(
      "/fluggastrechte/formular",
      "/",
      mockURLSearchParams,
      null,
      mockFlowEngineSession,
      mockFlow,
    );

    expect(result.isOk).toBe(true);
  });

  it("should return ok if in case the page is not reachable and the url contains skipFlow in the search parameter", async () => {
    const mockFlowEngineSession = getMockFlowEngineSession(false);

    const result = await validateStepIdFlowNewEngine(
      "/fluggastrechte/formular",
      "/",
      new URLSearchParams({ skipFlow: "true" }),
      null,
      mockFlowEngineSession,
      mockFlow,
    );

    expect(result.isOk).toBe(true);
  });
});
