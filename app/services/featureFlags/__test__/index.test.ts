import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { config } from "~/services/env/web";
import { isFeatureFlagEnabled } from "../index";

// Mock the config module
vi.mock("~/services/env/web", () => ({
  config: vi.fn(),
}));

const mockIsFeatureEnabled = vi.fn();

vi.mock("~/services/analytics/posthogClient.server", () => ({
  getPosthogClient: () => ({
    isFeatureEnabled: mockIsFeatureEnabled,
  }),
}));

describe("isFeatureFlagEnabled", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return true when not in production environment", async () => {
    vi.mocked(config).mockReturnValue({
      ENVIRONMENT: "development",
      POSTHOG_API_HOST: "",
      POSTHOG_API_KEY: "",
      SENTRY_DSN: "undefined",
    });

    const result = await isFeatureFlagEnabled("showFluggastrechteFormular");

    expect(result).toBe(true);
  });

  describe("when in production environment", () => {
    beforeEach(() => {
      vi.mocked(config).mockReturnValue({
        ENVIRONMENT: "production",
        POSTHOG_API_KEY: "test-api-key",
        POSTHOG_API_HOST: "posthog-host",
        SENTRY_DSN: undefined,
      });
    });

    it("should handle PostHog client returning true", async () => {
      mockIsFeatureEnabled.mockResolvedValue(true);
      const result = await isFeatureFlagEnabled("showGeldEinklagenFlow");

      expect(result).toBe(true);
      expect(mockIsFeatureEnabled).toHaveBeenCalledWith(
        "showGeldEinklagenFlow",
        "backend",
      );
    });

    it("should handle PostHog client returning false", async () => {
      mockIsFeatureEnabled.mockResolvedValue(false);

      const result = await isFeatureFlagEnabled("showProzesskostenhilfeFlow");

      expect(result).toBe(false);
      expect(mockIsFeatureEnabled).toHaveBeenCalledWith(
        "showProzesskostenhilfeFlow",
        "backend",
      );
    });
  });
});
