import { getRedirectForNonRelativeUrl } from "../getRedirectForNonRelativeUrl";

describe("getRedirectForNonRelativeUrl", () => {
  test("should return 400 and success: false when searchParameterUrl does not start with '/'", () => {
    const nonRelativeUrl = "https://example.com";

    const response = getRedirectForNonRelativeUrl(nonRelativeUrl);

    expect(response?.status).toBe(400);
  });

  test("should not return a response if the searchParameterUrl starts with '/'", () => {
    const relativeUrl = "/relative/path";

    const response = getRedirectForNonRelativeUrl(relativeUrl);

    expect(response).toBeUndefined();
  });
});
