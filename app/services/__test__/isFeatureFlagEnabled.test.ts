import type { PostHog } from "posthog-node";
import { getPosthogNodeClient } from "~/services/analytics/posthogClient.server";
import { config } from "../env/env.server";
import { isFeatureFlagEnabled } from "../isFeatureFlagEnabled.server";

vi.mock("~/services/analytics/posthogClient.server");

vi.mock("../env/env.server", () => ({
  config: vi.fn().mockReturnValue({
    USE_LOCAL_FEATURE_FLAGS: false,
  } as unknown as ReturnType<typeof config>),
}));

describe("isFeatureFlagEnabled", () => {
  const mockIsFeatureEnabled = vi.fn();

  vi.mocked(getPosthogNodeClient).mockReturnValue({
    isFeatureEnabled: mockIsFeatureEnabled.mockResolvedValue(true),
  } as unknown as PostHog);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("passes feature flag to PostHog and returns the results", async () => {
    const result = await isFeatureFlagEnabled("showGeldEinklagenFlow");
    expect(result).toBe(true);
    expect(mockIsFeatureEnabled).toHaveBeenCalledWith(
      "showGeldEinklagenFlow",
      "backend",
    );
  });

  it("falls back to local config if posthog instance is undefined", async () => {
    vi.mocked(getPosthogNodeClient).mockReturnValueOnce(undefined);
    const result = await isFeatureFlagEnabled("showGeldEinklagenFlow");
    expect(result).toBe(false);
  });

  it("falls back to local config if USE_LOCAL_FEATURE_FLAGS is enabled", async () => {
    const resultBefore = await isFeatureFlagEnabled("showGeldEinklagenFlow");

    vi.mocked(config).mockReturnValueOnce({
      USE_LOCAL_FEATURE_FLAGS: true,
    } as unknown as ReturnType<typeof config>);

    const resultAfter = await isFeatureFlagEnabled("showGeldEinklagenFlow");
    expect(resultBefore).toBe(true);
    expect(resultAfter).toBe(false);
  });
});
