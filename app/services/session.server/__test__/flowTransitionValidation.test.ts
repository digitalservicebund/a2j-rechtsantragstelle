import type { FlowId } from "~/flows/flowIds";
import type { Flow } from "~/flows/flows.server";
import type { FlowPageId } from "~/services/cms/schemas";
import {
  buildFlowController,
  type FlowController,
} from "~/services/flow/server/buildFlowController";
import { getSessionData } from "..";
import {
  type FlowTransitionConfig,
  validateFlowTransition,
} from "../flowTransitionValidation.server";

vi.mock("app/services/session.server/index", () => ({
  getSessionData: vi.fn(),
}));

vi.mock("app/services/flow/server/buildFlowController", () => ({
  buildFlowController: vi.fn(),
}));

const createMockFlow = (cmsSlug: FlowPageId): Flow => ({
  config: {},
  guards: {},
  cmsSlug,
});

describe("validateFlowTransition", () => {
  const mockFlowId: FlowId = "/fluggastrechte/vorabcheck";
  const mockCookieHeader = "mock-cookie";
  const mockFlows: Record<FlowId, Flow> = {
    "/beratungshilfe/vorabcheck": createMockFlow("form-flow-pages"),
    "/beratungshilfe/antrag": createMockFlow("form-flow-pages"),
    "/geld-einklagen/vorabcheck": createMockFlow("vorab-check-pages"),
    "/geld-einklagen/formular": createMockFlow("form-flow-pages"),
    "/fluggastrechte/vorabcheck": createMockFlow("vorab-check-pages"),
    "/fluggastrechte/formular": createMockFlow("form-flow-pages"),
    "/prozesskostenhilfe/antrag": createMockFlow("form-flow-pages"),
  };
  const mockController: FlowController = {
    getMeta: vi.fn().mockReturnValue(undefined),
    getRootMeta: vi.fn().mockReturnValue(undefined),
    stepStates: vi.fn().mockReturnValue([]),
    isDone: vi.fn().mockReturnValue(false),
    getProgress: vi.fn().mockReturnValue({}),
    isReachable: vi
      .fn()
      .mockImplementation((page: string) => page === "ergebnis/erfolg"),
    getConfig: vi.fn().mockReturnValue({}),
    isFinal: vi.fn().mockReturnValue(false),
    getPrevious: vi.fn().mockReturnValue(undefined),
    getNext: vi.fn().mockReturnValue(undefined),
    getInitial: vi.fn().mockReturnValue("mock"),
  };

  it("should return eligibility as true if at least one eligible source page is reachable", async () => {
    const config: FlowTransitionConfig = {
      targetFlowId: mockFlowId,
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
      mockFlowId,
      mockCookieHeader,
      config,
    );

    expect(result).toStrictEqual({
      isEligible: true,
    });
  });

  it("should return eligibility as false if none of the eligible source pages are reachable", async () => {
    const config: FlowTransitionConfig = {
      targetFlowId: mockFlowId,
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
      mockFlowId,
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
      targetFlowId: mockFlowId,
      sourceFlowId: mockFlowId,
      eligibleSourcePages: [],
    };

    await expect(
      validateFlowTransition(mockFlows, mockFlowId, mockCookieHeader, config),
    ).rejects.toThrow("This property should not be empty");
  });
});
