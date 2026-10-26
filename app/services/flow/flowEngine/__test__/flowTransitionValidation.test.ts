import { type FlowId } from "~/domains/flowIds";
import { type Flow, type FlowType } from "~/domains/flows.server";
import {
  compileFlow,
  type CompiledFlow,
} from "~/services/flow/flowEngine/compileFlow";
import {
  type FlowTransitionConfig,
  validateFlowTransition,
} from "~/services/flow/flowEngine/flowTransitionValidation";
import { type PageConfigMap } from "~/services/flow/flowEngine/types";

import { getSessionData } from "~/services/session.server";

vi.mock("~/services/session.server/index");

const mockFlowId: FlowId = "/erbschein/anfrage";
const mockFlowTransitionConfig: FlowTransitionConfig = {
  sourceFlowId: mockFlowId,
  eligibleSourcePages: ["/ergebnis/erfolg-totally", "/ergebnis/erfolg"],
};

const createMockFlow = (flowType: FlowType): Flow => ({
  flowType,
  config: compileFlow({
    pages: {
      start: {
        stepId: "/start",
      },
      ergebnis: {
        stepId: "/ergebnis/erfolg",
      },
    },
    initialStep: "start",
    transitions: {
      start: "ergebnis",
      ergebnis: null,
    },
    flowTransitionConfig: mockFlowTransitionConfig,
    pruningStrategy: "cascading",
  }) as CompiledFlow<PageConfigMap>,
});

describe("flowTransitionValidation", () => {
  const mockCookieHeader = "mock-cookie";
  const sourceFlow = createMockFlow("vorabCheck");

  it("should return eligibility as true if at least one eligible source page is reachable", async () => {
    vi.mocked(getSessionData).mockResolvedValueOnce({ userData: {} });

    const result = await validateFlowTransition(
      sourceFlow,
      mockCookieHeader,
      mockFlowTransitionConfig,
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

    vi.mocked(getSessionData).mockResolvedValueOnce({ userData: {} });

    const result = await validateFlowTransition(
      sourceFlow,
      mockCookieHeader,
      config,
    );

    expect(result).toStrictEqual({
      isEligible: false,
      redirectTo: "/erbschein/anfrage",
    });
  });

  it("should throw an error if eligibleSourcePages is an empty array", async () => {
    const config: FlowTransitionConfig = {
      sourceFlowId: mockFlowId,
      eligibleSourcePages: [],
    };

    await expect(
      validateFlowTransition(sourceFlow, mockCookieHeader, config),
    ).rejects.toThrow("This property should not be empty");
  });

  it("should throw an error if the source flow does not have a config", async () => {
    const sourceFlowWithoutConfig: Flow = {
      flowType: "vorabCheck",
    };

    await expect(
      validateFlowTransition(
        sourceFlowWithoutConfig,
        mockCookieHeader,
        mockFlowTransitionConfig,
      ),
    ).rejects.toThrow(
      `Source flow ${mockFlowId} does not have a config, which is required for flow transitions.`,
    );
  });
});
