import type { FlowId } from "~/domains/flowIds";
import type { Flow, FlowType } from "~/domains/flows.server";
import {
  buildFlowController,
  type FlowController,
} from "~/services/flow/server/buildFlowController";
import { getSessionData } from "~/services/session.server";
import {
  type FlowTransitionConfig,
  validateFlowTransition,
} from "../flowTransitionValidation";

vi.mock("~/services/session.server/index", () => ({
  getSessionData: vi.fn(),
}));

vi.mock("~/services/flow/server/buildFlowController", () => ({
  buildFlowController: vi.fn(),
}));

const createMockFlow = (flowType: FlowType): Flow => ({
  config: {},
  guards: {},
  flowType,
});

describe("flowTransitionValidation", () => {
  const mockFlowId: FlowId = "/fluggastrechte/vorabcheck";
  const mockCookieHeader = "mock-cookie";
  const mockFlows: Record<FlowId, Flow> = {
    "/beratungshilfe/vorabcheck": createMockFlow("formFlow"),
    "/beratungshilfe/antrag": createMockFlow("formFlow"),
    "/geld-einklagen/vorabcheck": createMockFlow("vorabCheck"),
    "/geld-einklagen/formular": createMockFlow("formFlow"),
    "/fluggastrechte/vorabcheck": createMockFlow("vorabCheck"),
    "/fluggastrechte/formular": createMockFlow("formFlow"),
    "/prozesskostenhilfe/formular": createMockFlow("formFlow"),
    "/schulden/vorabcheck": createMockFlow("formFlow"),
  };
  const mockController: FlowController = {
    getMeta: vi.fn().mockReturnValue(undefined),
    getRootMeta: vi.fn().mockReturnValue(undefined),
    stepStates: vi.fn().mockReturnValue([]),
    getProgress: vi.fn().mockReturnValue({}),
    getReachableSteps: vi.fn().mockReturnValue([]),
    getUserdata: vi.fn().mockReturnValue({}),
    isReachable: vi
      .fn()
      .mockImplementation((page: string) => page === "ergebnis/erfolg"),
    getConfig: vi.fn().mockReturnValue({}),
    getGuards: vi.fn().mockReturnValue({}),
    isFinal: vi.fn().mockReturnValue(false),
    getPrevious: vi.fn().mockReturnValue(undefined),
    getNext: vi.fn().mockReturnValue(undefined),
    getInitial: vi.fn().mockReturnValue("mock"),
  };

  it("should return eligibility as true if at least one eligible source page is reachable", async () => {
    const config: FlowTransitionConfig = {
      sourceFlowId: mockFlowId,
      eligibleSourcePages: ["ergebnis/erfolg-totally", "ergebnis/erfolg"],
    };

    vi.mocked(getSessionData).mockResolvedValueOnce({
      userData: {},
      debugId: "debugId",
    });

    vi.mocked(buildFlowController).mockReturnValue(mockController);

    const result = await validateFlowTransition(
      mockFlows,
      mockCookieHeader,
      config,
    );

    expect(result).toStrictEqual({
      isEligible: true,
    });
  });

  it("should return eligibility as false if none of the eligible source pages are reachable", async () => {
    const config: FlowTransitionConfig = {
      sourceFlowId: mockFlowId,
      eligibleSourcePages: ["page1", "page2"],
    };

    vi.mocked(getSessionData).mockResolvedValueOnce({
      userData: {},
      debugId: "debugId",
    });

    vi.mocked(buildFlowController).mockReturnValue(mockController);

    const result = await validateFlowTransition(
      mockFlows,
      mockCookieHeader,
      config,
    );

    expect(result).toStrictEqual({
      isEligible: false,
      redirectTo: "/fluggastrechte/vorabcheck",
    });
  });

  it("should throw an error if eligibleSourcePages is an empty array", async () => {
    const config: FlowTransitionConfig = {
      sourceFlowId: mockFlowId,
      eligibleSourcePages: [],
    };

    await expect(
      validateFlowTransition(mockFlows, mockCookieHeader, config),
    ).rejects.toThrow("This property should not be empty");
  });
});
