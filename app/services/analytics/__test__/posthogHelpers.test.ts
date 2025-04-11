import { idFromCookie } from "~/services/analytics/posthogHelpers";

let mockAPIKey: string | undefined;
vi.mock("~/services/env/web", () => ({
  config: () => ({ POSTHOG_API_KEY: mockAPIKey, ENVIRONMENT: "local" }),
}));

let phCookieString: string | undefined;
vi.mock("cookie", () => ({
  parse: () => ({
    [`ph_${mockAPIKey}_posthog`]: phCookieString,
  }),
}));

describe("posthogHelpers", () => {
  describe("idFromCookie", () => {
    it("should return ENVIRONMENT if POSTHOG_API_KEY is unavailable", () => {
      expect(idFromCookie("cookieString")).toBe("local");
    });

    it("should return ENVIRONMENT if the posthog cookie's distinct_id is undefined", () => {
      mockAPIKey = "mockAPIKey";
      expect(idFromCookie("cookieString")).toBe("local");
    });

    it("should return the posthog cookie's distinct_id", () => {
      mockAPIKey = "mockAPIKey";
      phCookieString = '{"distinct_id": "mockDistinctId"}';
      expect(idFromCookie("cookieString")).toBe("mockDistinctId");
    });
  });
});
