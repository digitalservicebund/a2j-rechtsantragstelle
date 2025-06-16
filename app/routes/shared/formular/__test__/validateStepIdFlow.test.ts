import { type Flow } from "~/domains/flows.server";
import { type buildFlowController } from "~/services/flow/server/buildFlowController";
import * as validateFlowTransition from "~/services/flow/server/flowTransitionValidation";
import { validateStepIdFlow } from "../validateStepIdFlow";

const mockRequest = new Request(
  "http://example.com/fluggastrechte/formular?stepId=ergebnis/erfolg",
);

const INITIAL_PAGE_FLOW = "ergebnis/initial";

const getMockFlowController = (isReachable: boolean) => {
  return {
    isReachable: vi.fn().mockReturnValue(isReachable),
    getInitial: vi.fn().mockReturnValue(INITIAL_PAGE_FLOW),
  } as unknown as ReturnType<typeof buildFlowController>;
};

const currentFlow = {
  config: {},
  guards: {},
  flowType: "formFlow",
} as unknown as Flow;

describe("validateStepIdFlow", () => {
  it("should return an error and the to redirect to initial flow page in case the page is not reachable", async () => {
    const mockFlowController = getMockFlowController(false);

    const result = await validateStepIdFlow(
      "ergebnis/erfolg",
      mockRequest,
      mockFlowController,
      currentFlow,
    );

    expect(result.isErr).toBe(true);
    expect(result.isErr ? result.error.redirectTo : "").toBe(INITIAL_PAGE_FLOW);
  });

  it("should return an error and the to redirect to the page from the parameter `redirectTo` in case the page is not eligible", async () => {
    const mockFlowController = getMockFlowController(true);

    const currentFlowNotEligible = {
      config: {},
      guards: {},
      flowType: "formFlow",
      flowTransitionConfig: {
        sourceFlowId: "ergebnis/erfolg/source",
        eligibleSourcePages: ["ergebnis/erfolg-totally", "ergebnis/erfolg"],
      },
    } as unknown as Flow;

    vi.spyOn(
      validateFlowTransition,
      "validateFlowTransition",
    ).mockResolvedValue({
      isEligible: false,
      redirectTo: "ergebnis/erfolg/source",
    });

    const result = await validateStepIdFlow(
      "ergebnis/erfolg",
      mockRequest,
      mockFlowController,
      currentFlowNotEligible,
    );

    expect(result.isErr).toBe(true);
    expect(result.isErr ? result.error.redirectTo : "").toBe(
      "ergebnis/erfolg/source",
    );
  });

  it("should return ok if the step ID flow is correct", async () => {
    const mockFlowController = getMockFlowController(true);

    const result = await validateStepIdFlow(
      "ergebnis/erfolg",
      mockRequest,
      mockFlowController,
      currentFlow,
    );

    expect(result.isOk).toBe(true);
  });
});
