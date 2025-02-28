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
  it("extracts the existing valid flowIds", () => {
    expect(flowIdFromPathname("/beratungshilfe/antrag")).toEqual(
      "/beratungshilfe/antrag",
    );

    expect(flowIdFromPathname("/kontopfaendung/vorabcheck")).toEqual(
      "/kontopfaendung/vorabcheck",
    );
  });

  it("returns undefined if no valid flow Id", () => {
    expect(flowIdFromPathname("")).toBeUndefined();
    expect(flowIdFromPathname("asd")).toBeUndefined();
    expect(flowIdFromPathname("asd/")).toBeUndefined();
    expect(flowIdFromPathname("asd/asd")).toBeUndefined();
  });
});
