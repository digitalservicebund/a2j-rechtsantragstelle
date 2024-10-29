import { getYoutubeVideoId, isExternalUrl, isFileDownloadUrl } from "../url";

describe("isExternal", () => {
  it("returns true for external urls", () => {
    expect(isExternalUrl("https://example.com")).toBeTruthy();
  });
  it("returns false for internal links", () => {
    expect(isExternalUrl("/test")).toBeFalsy();
  });
});
describe("isFileDownloadUrl", () => {
  it("returns true for internal links to downloads", () => {
    expect(isFileDownloadUrl("/download/pdf")).toBeTruthy();
  });
});

describe("getYoutubeVideoId", () => {
  it('should grab the youtube video id from a "shared" url', () => {
    expect(
      getYoutubeVideoId("https://youtu.be/ZZ0o6NFCJeI?feature=shared"),
    ).toBe("ZZ0o6NFCJeI");
  });

  it("should grab the youtube video id from a regular browser url", () => {
    expect(
      getYoutubeVideoId("https://www.youtube.com/watch?v=ZZ0o6NFCJeI"),
    ).toBe("ZZ0o6NFCJeI");
  });

  it("should return undefined if an invalid youtube video url is given", () => {
    expect(getYoutubeVideoId("www.blah.com")).toBeUndefined();
  });
});
