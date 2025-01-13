import { isPreview } from "../params";

describe("isPreview", () => {
  it("should return true if preview is set", () => {
    const searchParams = new URLSearchParams();
    searchParams.set("preview", "");
    expect(isPreview(searchParams)).toBe(true);
  });

  it("should return false if preview is missing", () => {
    expect(isPreview(new URLSearchParams())).toBe(false);
  });
});
