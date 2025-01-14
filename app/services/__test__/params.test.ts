import { searchParamsContainPreview } from "../params";

describe("isPreview", () => {
  it("should return true if preview is set", () => {
    const searchParams = new URLSearchParams();
    searchParams.set("preview", "");
    expect(searchParamsContainPreview(searchParams)).toBe(true);
  });

  it("should return false if preview is missing", () => {
    expect(searchParamsContainPreview(new URLSearchParams())).toBe(false);
  });
});
