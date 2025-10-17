import type { PostHog } from "posthog-node";
import { getPosthogNodeClient } from "~/services/analytics/posthogClient.server";
import { isFeatureFlagEnabled } from "../isFeatureFlagEnabled.server";

vi.mock("~/services/analytics/posthogClient.server");

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
    expect(result).toBe(true);
  });
});
