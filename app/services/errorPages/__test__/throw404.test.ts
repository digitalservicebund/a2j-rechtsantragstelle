import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { config } from "~/services/env/public";
import { mockPublicConfig } from "~/services/env/__test__/publicConfigMock";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import {
  throw404OnProduction,
  throw404IfFeatureFlagDisabled,
} from "../throw404";
import { assertResponse } from "~/routes/__test__/isResponse";

vi.mock("~/services/env/public", () => ({
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
    vi.mocked(config).mockReturnValue(
      mockPublicConfig({ ENVIRONMENT: "production" }),
    );

    try {
      throw404OnProduction();
    } catch (error) {
      assertResponse(error);
      expect(error.status).toBe(404);
    }
  });

  it("should not throw in non-production environment", () => {
    vi.mocked(config).mockReturnValue(
      mockPublicConfig({ ENVIRONMENT: "development" }),
    );

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
      assertResponse(error);
      expect(error.status).toBe(404);
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
