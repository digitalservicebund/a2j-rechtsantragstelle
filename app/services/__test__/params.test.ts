import { previewAllowedAndEnabled } from "../params";

describe("previewAllowedAndEnabled", () => {
  describe("with preview param present", () => {
    const searchParamsWithPreview = new URLSearchParams();
    searchParamsWithPreview.set("preview", "");

    it("should return true normally", () => {
      expect(previewAllowedAndEnabled(searchParamsWithPreview)).toBe(true);
    });

    it("should always return false if env is production", () => {
      vi.stubEnv("ENVIRONMENT", "production");
      expect(previewAllowedAndEnabled(searchParamsWithPreview)).toBe(false);
    });
  });

  it("should return false if preview is missing", () => {
    expect(previewAllowedAndEnabled(new URLSearchParams())).toBe(false);
  });
});
