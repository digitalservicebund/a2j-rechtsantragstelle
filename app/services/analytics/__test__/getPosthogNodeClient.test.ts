import { PostHog } from "posthog-node";
import { getPosthogNodeClient, shutdownPosthog } from "../posthogClient.server";

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

describe("shutdownPosthog", () => {
  it("calls shutdown on the PostHog instance", async () => {
    const posthogClient = getPosthogNodeClient();
    if (!posthogClient) {
      throw new Error("PostHog client is not initialized");
    }
    const shutdownSpy = vi.spyOn(posthogClient, "shutdown").mockResolvedValue();
    vi.spyOn(console, "log");

    await shutdownPosthog(5000);
    expect(shutdownSpy).toHaveBeenCalledWith(5000);
    // oxlint-disable no-console
    expect(console.log).toHaveBeenCalledWith("✅ Posthog client shut down");
  });
});
