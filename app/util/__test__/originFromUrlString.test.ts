import { originFromUrlString } from "../originFromUrlString";

describe("originFromUrlString", () => {
  it("returns the origin of valid URLS", () => {
    expect(originFromUrlString("https://example.com/asd")).toEqual(
      "https://example.com",
    );
  });

  it("returns undefined for invalid or missing URLs", () => {
    expect(originFromUrlString()).toBeUndefined();
    expect(originFromUrlString("nonValidUrl")).toBeUndefined();
  });
});
