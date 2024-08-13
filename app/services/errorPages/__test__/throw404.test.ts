import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { config } from "~/services/env/web";
import { isFeatureFlagEnabled } from "~/services/featureFlags";
import {
  throw404OnProduction,
  throw404IfFeatureFlagDisabled,
} from "../throw404";

// Mock the config module
vi.mock("~/services/env/web", () => ({
  config: vi.fn(),
}));

// Mock the featureFlags module
vi.mock("~/services/featureFlags", () => ({
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
    // @ts-ignore
    vi.mocked(config).mockReturnValue({ ENVIRONMENT: "production" });

    try {
      throw404OnProduction();
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      // @ts-ignore
      expect(error.status).toBe(404);
    }
  });

  it("should not throw in non-production environment", () => {
    // @ts-ignore
    vi.mocked(config).mockReturnValue({ ENVIRONMENT: "development" });

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
      await throw404IfFeatureFlagDisabled("showProzesskostenhilfeFlow");
    } catch (error) {
      expect(error).toBeInstanceOf(Response);
      // @ts-ignore
      expect(error.status).toBe(404);
    }
  });

  it("should not throw if feature flag is enabled", async () => {
    vi.mocked(isFeatureFlagEnabled).mockResolvedValue(true);

    await expect(
      throw404IfFeatureFlagDisabled("showProzesskostenhilfeFlow"),
    ).resolves.not.toThrow();
  });

  it("should call isFeatureFlagEnabled with the correct feature flag", async () => {
    vi.mocked(isFeatureFlagEnabled).mockResolvedValue(true);

    await throw404IfFeatureFlagDisabled("showProzesskostenhilfeFlow");

    expect(isFeatureFlagEnabled).toHaveBeenCalledWith(
      "showProzesskostenhilfeFlow",
    );
  });
});
