import * as flowLifecycleOverridesInHours from "~/domains/flowLifecycleConfig";
import {
  getLifecycleTimeBySessionUserData,
  getMaxAgeLifecycle,
} from "../lifecycleSession";

describe("lifecycleSession", () => {
  describe("getLifecycleTimeBySessionUserData", () => {
    it("should return the default time to live for 'main' context", () => {
      const result = getLifecycleTimeBySessionUserData("main");
      expect(result).toBe(86400); // 24 hours in seconds
    });

    it("should return the lifecycle time for a specific flow context", () => {
      const result = getLifecycleTimeBySessionUserData(
        "/geld-einklagen/formular",
      );
      expect(result).toBe(2592000); // 720 hours in seconds
    });

    it("should return the default time to live for an unknown context", () => {
      const result = getLifecycleTimeBySessionUserData(
        "unknown-context" as any,
      );
      expect(result).toBe(86400); // 24 hours in seconds
    });
  });

  describe("getMaxAgeLifecycle", () => {
    it("should return the maximum lifecycle time based on overrides", () => {
      vi.spyOn(
        flowLifecycleOverridesInHours,
        "flowLifecycleOverridesInHours",
        "get",
      ).mockReturnValue({
        "/geld-einklagen/formular": 720,
        "/beratungshilfe/antrag": 800,
      });

      const result = getMaxAgeLifecycle();
      expect(result).toBe(2880000); // 800 hours in seconds
    });
  });
});
