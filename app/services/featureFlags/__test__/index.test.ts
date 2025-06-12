import type { PostHog } from "posthog-node";
import { getPosthogNodeClient } from "~/services/analytics/posthogClient.server";
import { isFeatureFlagEnabled } from "../index";

vi.mock("~/services/analytics/posthogClient.server");

describe("isFeatureFlagEnabled", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("passes feature flag to PostHog and returns the results", async () => {
    const mockIsFeatureEnabled = vi.fn();

    vi.mocked(getPosthogNodeClient).mockReturnValueOnce({
      isFeatureEnabled: mockIsFeatureEnabled.mockResolvedValue(true),
    } as unknown as PostHog);

    const result = await isFeatureFlagEnabled("showGeldEinklagenFlow");
    expect(result).toBe(true);
    expect(mockIsFeatureEnabled).toHaveBeenCalledWith(
      "showGeldEinklagenFlow",
      "backend",
    );
  });

  it("handles undefined posthog instance", async () => {
    vi.mocked(getPosthogNodeClient).mockReturnValueOnce(undefined);
    const result = await isFeatureFlagEnabled("showGeldEinklagenFlow");
    expect(result).toBeUndefined();
  });
});
