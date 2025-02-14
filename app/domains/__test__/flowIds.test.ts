import { flowIdFromPathname, parsePathname } from "../flowIds";

describe("parsePathname", () => {
  it("works for valid flow IDs", () => {
    expect(parsePathname("/beratungshilfe/antrag/test123")).toEqual({
      flowId: "/beratungshilfe/antrag",
      stepId: "/test123",
      arrayIndexes: [],
    });
  });

  it("returns multiple array indexes", () => {
    expect(parsePathname("/beratungshilfe/antrag/test123/0/asd/1")).toEqual({
      flowId: "/beratungshilfe/antrag",
      stepId: "/test123/asd",
      arrayIndexes: [0, 1],
    });
  });

  it("throws for invalid flow IDs", () => {
    expect(() => parsePathname("/invalid")).toThrow();
  });
});

describe("flowIdFromPathname", () => {
  it("extracts the first two path segments", () => {
    expect(flowIdFromPathname("/beratungshilfe/antrag")).toEqual(
      "/beratungshilfe/antrag",
    );
  });

  it("extract the nested path segments if flowId doesn't", () => {
    expect(flowIdFromPathname("/schulden/kontopfaendung/wegweiser")).toEqual(
      "/schulden/kontopfaendung/wegweiser",
    );
  });

  it("returns undefined if no valid flow Id", () => {
    expect(flowIdFromPathname("")).toBeUndefined();
    expect(flowIdFromPathname("asd")).toBeUndefined();
    expect(flowIdFromPathname("asd/")).toBeUndefined();
    expect(flowIdFromPathname("asd/asd")).toBeUndefined();
  });
});
