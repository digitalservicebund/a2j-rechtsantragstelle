import { getPageAndFlowDataFromRequest } from "../getPageAndFlowDataFromRequest";

describe("getPageAndFlowDataFromRequest", () => {
  it("should extract flowId, stepId, and arrayIndexes from request URL", () => {
    const mockRequest = new Request(
      "http://example.com/fluggastrechte/formular/stepId1/2",
    );

    const { flowId, stepId, arrayIndexes } =
      getPageAndFlowDataFromRequest(mockRequest);

    expect(flowId).toBe("/fluggastrechte/formular");
    expect(stepId).toBe("/stepId1");
    expect(arrayIndexes).toEqual([2]);
  });
});
