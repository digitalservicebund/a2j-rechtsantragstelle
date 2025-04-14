import { parse } from "cookie";
import { idFromCookie } from "~/services/analytics/posthogHelpers";
import { config } from "~/services/env/web";

const mockAPIKey = "mockAPIKey";
vi.mock("~/services/env/web", () => ({
  config: vi.fn(),
}));

vi.mock("cookie", () => ({
  parse: vi.fn(),
}));

describe("posthogHelpers", () => {
  describe("idFromCookie", () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should return ENVIRONMENT if POSTHOG_API_KEY is unavailable", () => {
      vi.mocked(config).mockReturnValue({
        POSTHOG_API_KEY: undefined,
        POSTHOG_API_HOST: "",
        SENTRY_DSN: undefined,
        ENVIRONMENT: "local",
      });
      expect(idFromCookie("cookieString")).toBe("client-local");
    });

    it("should return ENVIRONMENT if the posthog cookie's distinct_id is undefined", () => {
      vi.mocked(config).mockReturnValue({
        POSTHOG_API_KEY: mockAPIKey,
        POSTHOG_API_HOST: "",
        SENTRY_DSN: undefined,
        ENVIRONMENT: "local",
      });
      vi.mocked(parse).mockReturnValue({
        [`ph_${mockAPIKey}_posthog`]: "{}",
      });
      expect(idFromCookie("cookieString")).toBe("client-local");
    });

    it("should return the posthog cookie's distinct_id", () => {
      vi.mocked(config).mockReturnValue({
        POSTHOG_API_KEY: mockAPIKey,
        POSTHOG_API_HOST: "",
        SENTRY_DSN: undefined,
        ENVIRONMENT: "local",
      });
      vi.mocked(parse).mockReturnValue({
        [`ph_${mockAPIKey}_posthog`]: '{"distinct_id": "mockDistinctId"}',
      });
      expect(idFromCookie("cookieString")).toBe("mockDistinctId");
    });
  });
});
