import type { PostHogOptions } from "posthog-node";
import { PostHog } from "posthog-node";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { config } from "~/services/env/web";
import { isFeatureFlagEnabled } from "../index";

type PartialPostHogParams = Partial<PostHog & PostHogOptions>;

// Mock the PostHog module
vi.mock("posthog-node", () => {
  return {
    PostHog: vi.fn(() => ({
      isFeatureEnabled: vi.fn(),
    })),
  };
});

// Mock the config module
vi.mock("~/services/env/web", () => ({
  config: vi.fn(),
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
    expect(PostHog).not.toHaveBeenCalled();
  });

  it("should return undefined when POSTHOG_API_KEY is not set", async () => {
    vi.mocked(config).mockReturnValue({
      ENVIRONMENT: "production",
      POSTHOG_API_KEY: undefined,
      POSTHOG_API_HOST: "https://app.posthog.com",
      SENTRY_DSN: undefined,
    });

    const result = await isFeatureFlagEnabled("showFluggastrechteFormular");

    expect(result).toBeUndefined();
    expect(PostHog).not.toHaveBeenCalled();
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
      const mockIsFeatureEnabled = vi.fn().mockResolvedValue(true);
      vi.mocked(PostHog).mockImplementation(
        () =>
          ({
            isFeatureEnabled: mockIsFeatureEnabled,
          }) as PartialPostHogParams,
      );

      const result = await isFeatureFlagEnabled("showGeldEinklagenFlow");

      expect(result).toBe(true);
      expect(PostHog).toHaveBeenCalledWith("test-api-key", {
        host: "posthog-host",
      });
      expect(mockIsFeatureEnabled).toHaveBeenCalledWith(
        "showGeldEinklagenFlow",
        "backend",
      );
    });

    it("should handle PostHog client returning false", async () => {
      const mockIsFeatureEnabled = vi.fn().mockResolvedValue(false);
      vi.mocked(PostHog).mockImplementation(
        () =>
          ({
            isFeatureEnabled: mockIsFeatureEnabled,
          }) as PartialPostHogParams,
      );

      const result = await isFeatureFlagEnabled("showProzesskostenhilfeFlow");

      expect(result).toBe(false);
      expect(PostHog).toHaveBeenCalledWith("test-api-key", {
        host: "posthog-host",
      });
      expect(mockIsFeatureEnabled).toHaveBeenCalledWith(
        "showProzesskostenhilfeFlow",
        "backend",
      );
    });
  });
});
