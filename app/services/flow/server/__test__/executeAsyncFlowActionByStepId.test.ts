import type { Flow } from "~/domains/flows.server";
import { executeAsyncFlowActionByStepId } from "../executeAsyncFlowActionByStepId";

describe("executeAsyncFlowActionByStepId", () => {
  const mockRequest = new Request("http://localhost");
  const mockAsyncFlowAction = vi.fn().mockResolvedValue(undefined);
  const mockFlow: Flow = {
    asyncFlowActions: {
      step1: mockAsyncFlowAction,
    },
  } as unknown as Flow;

  it("should execute the async flow action for the given stepId", async () => {
    await executeAsyncFlowActionByStepId(mockFlow, "step1", mockRequest, {});
    expect(mockAsyncFlowAction).toHaveBeenCalledWith(mockRequest, {});
  });

  it("should not execute the async flow action for the given another stepId", async () => {
    await executeAsyncFlowActionByStepId(mockFlow, "step2", mockRequest, {});
    expect(mockAsyncFlowAction).not.toHaveBeenCalledWith(mockRequest);
  });
});
