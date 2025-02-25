import { describe, it, expect } from "vitest";
import { kontopfaendungWegweiser } from "../index";
import { kontopfaendungWegweiserXstateConfig } from "../xStateConfig";

describe("kontopfaendungWegweiser Flow Configuration", () => {
  it('should have flowType "vorabCheck"', () => {
    expect(kontopfaendungWegweiser.flowType).toBe("vorabCheck");
  });

  it("should have the correct config", () => {
    expect(kontopfaendungWegweiser.config).toBe(
      kontopfaendungWegweiserXstateConfig,
    );
  });

  it("should have an empty guards object", () => {
    expect(kontopfaendungWegweiser.guards).toEqual({});
  });
});
