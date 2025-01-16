import { skipFlowParamAllowedAndEnabled } from "../params";

describe("previewAllowedAndEnabled", () => {
  describe("with preview param present", () => {
    const searchParamsWithPreview = new URLSearchParams();
    searchParamsWithPreview.set("skipFlow", "");

    it("should return true normally", () => {
      expect(skipFlowParamAllowedAndEnabled(searchParamsWithPreview)).toBe(
        true,
      );
    });

    it("should always return false if env is production", () => {
      vi.stubEnv("ENVIRONMENT", "production");
      expect(skipFlowParamAllowedAndEnabled(searchParamsWithPreview)).toBe(
        false,
      );
    });
  });

  it("should return false if preview is missing", () => {
    expect(skipFlowParamAllowedAndEnabled(new URLSearchParams())).toBe(false);
  });
});
