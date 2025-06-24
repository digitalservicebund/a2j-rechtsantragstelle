import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";

describe("getPageAndFlowDataFromPathname", () => {
  it("should extract flowId, stepId, and arrayIndexes from request URL", () => {
    const mockPathname = "/fluggastrechte/formular/stepId1/2";
    const { flowId, stepId, arrayIndexes } =
      getPageAndFlowDataFromPathname(mockPathname);

    expect(flowId).toBe("/fluggastrechte/formular");
    expect(stepId).toBe("/stepId1");
    expect(arrayIndexes).toEqual([2]);
  });
});
