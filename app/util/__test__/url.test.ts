import { isExternalUrl, isFileDowloadUrl } from "../url";

describe("isExternal", () => {
  it("returns true for external urls", () => {
    expect(isExternalUrl("https://example.com")).toBeTruthy();
  });
  it("returns false for internal links", () => {
    expect(isExternalUrl("/test")).toBeFalsy();
  });
});
describe("isFileDowload", () => {
  it("returns true for internal links to downloads", () => {
    expect(isFileDowloadUrl("/download/pdf")).toBeTruthy();
  });
});
