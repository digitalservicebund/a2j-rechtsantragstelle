import { PostHog } from "posthog-node";
import { getPosthogNodeClient } from "../posthogClient.server";

vi.mock("~/services/env/public", () => ({
  config: vi.fn().mockReturnValue({
    POSTHOG_API_KEY: "phc_test",
    SENTRY_DSN: undefined,
    ENVIRONMENT: "test",
  }),
}));

describe("getPosthogNodeClient", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns a PostHog instance", () => {
    expect(getPosthogNodeClient()).toBeInstanceOf(PostHog);
  });
});
