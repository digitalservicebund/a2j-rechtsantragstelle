import type { PostHog } from "posthog-js";
import {
  shouldShowEstimatedTime,
  AP_EXPERIMENT_GROUP,
  AB_PATHNAME,
} from "../shouldShowEstimatedTime";

describe("shouldShowEstimatedTime", () => {
  it("should return true on valid path & in test group", () => {
    const posthogMock = {
      getFeatureFlag: () => AP_EXPERIMENT_GROUP,
    } as unknown as PostHog;
    expect(shouldShowEstimatedTime(AB_PATHNAME, posthogMock)).toBe(true);
  });

  it("should return false if not in test group", () => {
    const posthogMock = {
      getFeatureFlag: () => "control",
    } as unknown as PostHog;
    expect(shouldShowEstimatedTime(AB_PATHNAME, posthogMock)).toBe(false);
  });

  it("should return false if no group found", () => {
    const posthogMock = {
      getFeatureFlag: () => undefined,
    } as unknown as PostHog;
    expect(shouldShowEstimatedTime(AB_PATHNAME, posthogMock)).toBe(false);
  });

  it("should return false without posthog", () => {
    expect(shouldShowEstimatedTime(AB_PATHNAME)).toBe(false);
  });
});
