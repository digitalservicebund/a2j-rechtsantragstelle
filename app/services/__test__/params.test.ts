import { skipFlowParamAllowedAndEnabled } from "../params";

describe("skipFlowAllowedAndEnabled", () => {
  it.each([
    ["development", true],
    ["staging", true],
    ["preview", true],
    ["production", false],
  ])("with ?skipFlow in env %s returns %s", (env, expected) => {
    vi.stubEnv("PUBLIC_ENVIRONMENT", env);
    const searchParamsWithPreview = new URLSearchParams();
    searchParamsWithPreview.set("skipFlow", "");
    const actual = skipFlowParamAllowedAndEnabled(searchParamsWithPreview);
    expect(actual).toBe(expected);
  });

  it("should return false if preview is missing", () => {
    expect(skipFlowParamAllowedAndEnabled(new URLSearchParams())).toBe(false);
  });
});
