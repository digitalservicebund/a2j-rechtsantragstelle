import type { PostHog } from "posthog-node";
import { getPosthogNodeClient } from "~/services/analytics/posthogClient.server";
import { isFeatureFlagEnabled } from "../isFeatureFlagEnabled.server";

vi.mock("~/services/analytics/posthogClient.server");

describe("isFeatureFlagEnabled", () => {
  const mockEvaluateFlags = vi.fn();

  vi.mocked(getPosthogNodeClient).mockReturnValue({
    evaluateFlags: mockEvaluateFlags.mockResolvedValue({
      isEnabled: () => true,
    }),
  } as unknown as PostHog);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("passes feature flag to PostHog and returns the results", async () => {
    const result = await isFeatureFlagEnabled("showErbausschlagungFlow");
    expect(result).toBe(true);
    expect(mockEvaluateFlags).toHaveBeenCalledWith("backend");
  });

  it("falls back to local config if posthog instance is undefined", async () => {
    vi.mocked(getPosthogNodeClient).mockReturnValueOnce(undefined);
    const result = await isFeatureFlagEnabled("showErbausschlagungFlow");
    expect(result).toBe(true);
  });
});
