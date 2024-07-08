import { flowIDFromPathname, parsePathname } from "../flowIds";

describe("parsePathname", () => {
  it("works for valid flow IDs", () => {
    expect(parsePathname("/beratungshilfe/antrag/test123")).toEqual({
      flowId: "beratungshilfe/antrag",
      stepId: "test123",
      arrayIndexes: [],
    });
  });

  it("returns multiple array indexes", () => {
    expect(parsePathname("/beratungshilfe/antrag/test123/0/asd/1")).toEqual({
      flowId: "beratungshilfe/antrag",
      stepId: "test123/asd",
      arrayIndexes: [0, 1],
    });
  });

  it("throws for invalid flow IDs", () => {
    expect(() => parsePathname("/invalid")).toThrow();
  });
});

describe("parseFlowIdFromPathname", () => {
  it("extracts the first two path segments", () => {
    expect(flowIDFromPathname("/asd/asd")).toEqual("asd/asd");
  });

  it("returns root with ", () => {
    expect(flowIDFromPathname("")).toEqual("");
    expect(flowIDFromPathname("asd")).toEqual("");
    expect(flowIDFromPathname("asd/")).toEqual("");
    expect(flowIDFromPathname("asd/asd")).toEqual("");
  });
});
