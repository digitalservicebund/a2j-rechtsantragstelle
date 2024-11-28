import { json } from "@remix-run/node";
import { getRedirectForNonRelativeUrl } from "../getRedirectForNonRelativeUrl";

vitest.mock("@remix-run/node", () => ({
  json: vitest.fn(),
}));

describe("getRedirectForNonRelativeUrl", () => {
  afterEach(() => {
    vitest.clearAllMocks();
  });

  test("should return 400 and success: false when searchParameterUrl does not start with '/'", () => {
    const nonRelativeUrl = "https://example.com";

    getRedirectForNonRelativeUrl(nonRelativeUrl);

    expect(json).toHaveBeenCalledWith({ success: false }, { status: 400 });
  });

  test("should not return a response if the searchParameterUrl starts with '/'", () => {
    const relativeUrl = "/relative/path";

    getRedirectForNonRelativeUrl(relativeUrl);

    expect(json).not.toHaveBeenCalled();
  });
});
