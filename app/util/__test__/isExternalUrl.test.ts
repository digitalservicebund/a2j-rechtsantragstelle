import { isExternalUrl } from "../isExternalUrl";

describe("isExternalUrl", () => {
  it("returns true for external urls", () => {
    expect(isExternalUrl("https://example.com")).toBeTruthy();
  });
  it("returns true internal links to files", () => {
    expect(isExternalUrl("/test.pdf")).toBeTruthy();
  });
  it("returns false for internal links", () => {
    expect(isExternalUrl("/test")).toBeFalsy();
  });
});
