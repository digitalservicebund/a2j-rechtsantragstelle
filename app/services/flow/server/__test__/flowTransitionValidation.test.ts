import type { Flow } from "~/domains/flows.server";
import { executeAsyncFlowActionByStepId } from "../flowTransitionValidation";

describe("flowTransitionValidation", () => {
  describe("executeAsyncFlowActionByStepId", () => {
    const mockRequest = new Request("http://localhost");
    const mockAsyncFlowAction = vi.fn().mockResolvedValue(undefined);

    it("should execute the async flow action for the given stepId", async () => {
      const mockAsyncFlowAction = vi.fn().mockResolvedValue(undefined);
      const mockFlow: Flow = {
        asyncFlowActions: {
          "test-step": mockAsyncFlowAction,
        },
      } as unknown as Flow;

      await executeAsyncFlowActionByStepId(mockFlow, "test-step", mockRequest);

      expect(mockAsyncFlowAction).toHaveBeenCalledWith(mockRequest);
    });

    it("should not execute the async flow action for the given another stepId", async () => {
      const mockFlow: Flow = {
        asyncFlowActions: {
          "test-step": mockAsyncFlowAction,
        },
      } as unknown as Flow;

      await executeAsyncFlowActionByStepId(
        mockFlow,
        "another-step",
        mockRequest,
      );

      expect(mockAsyncFlowAction).not.toHaveBeenCalledWith(mockRequest);
    });
  });
});
