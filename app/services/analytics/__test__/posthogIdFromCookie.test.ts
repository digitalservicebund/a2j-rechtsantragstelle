import { parse } from "cookie";
import { posthogIdFromCookie } from "~/services/analytics/posthogIdFromCookie";
import { config } from "~/services/env/public";

const mockAPIKey = "mockAPIKey";
vi.mock("~/services/env/public", () => ({
  config: vi.fn(),
}));

vi.mock("cookie", () => ({
  parse: vi.fn(),
}));

describe("posthogIdFromCookie", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return ENVIRONMENT if POSTHOG_API_KEY is unavailable", () => {
    vi.mocked(config).mockReturnValue({
      POSTHOG_API_KEY: undefined,
      SENTRY_DSN: undefined,
      ENVIRONMENT: "local",
    });
    expect(posthogIdFromCookie("cookieString")).toBe("client-local");
  });

  it("should return ENVIRONMENT if the posthog cookie's distinct_id is undefined", () => {
    vi.mocked(config).mockReturnValue({
      POSTHOG_API_KEY: mockAPIKey,
      SENTRY_DSN: undefined,
      ENVIRONMENT: "local",
    });
    vi.mocked(parse).mockReturnValue({
      [`ph_${mockAPIKey}_posthog`]: "{}",
    });
    expect(posthogIdFromCookie("cookieString")).toBe("client-local");
  });

  it("should return the posthog cookie's distinct_id", () => {
    vi.mocked(config).mockReturnValue({
      POSTHOG_API_KEY: mockAPIKey,
      SENTRY_DSN: undefined,
      ENVIRONMENT: "local",
    });
    vi.mocked(parse).mockReturnValue({
      [`ph_${mockAPIKey}_posthog`]: '{"distinct_id": "mockDistinctId"}',
    });
    expect(posthogIdFromCookie("cookieString")).toBe("mockDistinctId");
  });
});
