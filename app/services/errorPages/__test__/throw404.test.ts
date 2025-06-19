import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { config } from "~/services/env/web";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import {
  throw404OnProduction,
  throw404IfFeatureFlagDisabled,
} from "../throw404";

vi.mock("~/services/env/web", () => ({
  config: vi.fn(),
}));

vi.mock("~/services/isFeatureFlagEnabled.server", () => ({
  isFeatureFlagEnabled: vi.fn(),
}));

describe("throw404OnProduction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should throw a 404 Response in production environment", () => {
    vi.mocked(config).mockReturnValue({
      ENVIRONMENT: "production",
      POSTHOG_API_HOST: "",
      POSTHOG_API_KEY: "",
      SENTRY_DSN: "",
    });

    try {
      throw404OnProduction();
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect((error as Response).status).toBe(404);
    }
  });

  it("should not throw in non-production environment", () => {
    vi.mocked(config).mockReturnValue({
      ENVIRONMENT: "development",
      POSTHOG_API_HOST: "",
      POSTHOG_API_KEY: "",
      SENTRY_DSN: "",
    });

    expect(() => throw404OnProduction()).not.toThrow();
  });
});

describe("throw404IfFeatureFlagDisabled", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should throw a 404 Response if feature flag is disabled", async () => {
    vi.mocked(isFeatureFlagEnabled).mockResolvedValue(false);

    try {
      await throw404IfFeatureFlagDisabled("showGeldEinklagenFlow");
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      expect((error as Response).status).toBe(404);
    }
  });

  it("should not throw if feature flag is enabled", async () => {
    vi.mocked(isFeatureFlagEnabled).mockResolvedValue(true);

    await expect(
      throw404IfFeatureFlagDisabled("showGeldEinklagenFlow"),
    ).resolves.not.toThrow();
  });

  it("should call isFeatureFlagEnabled with the correct feature flag", async () => {
    vi.mocked(isFeatureFlagEnabled).mockResolvedValue(true);

    await throw404IfFeatureFlagDisabled("showGeldEinklagenFlow");

    expect(isFeatureFlagEnabled).toHaveBeenCalledWith("showGeldEinklagenFlow");
  });
});
