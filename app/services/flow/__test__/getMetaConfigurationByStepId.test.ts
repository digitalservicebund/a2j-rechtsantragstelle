import type { Flow } from "~/domains/flows.server";
import { getMetaConfigurationByStepId } from "~/services/flow/getMetaConfigurationByStepId";

const createFlow = (metaConfiguration?: Flow["metaConfiguration"]): Flow =>
  ({
    flowType: "formFlow",
    config: {},
    metaConfiguration,
  }) as Flow;

describe("getMetaConfigurationByStepId", () => {
  it("returns undefined if no metaConfiguration exists", () => {
    const flow = createFlow();

    const actual = getMetaConfigurationByStepId(flow, "/abgabe/check");

    expect(actual).toBeUndefined();
  });

  it("merges parent and exact step configuration", () => {
    const flow = createFlow({
      "/abgabe": { excludedFromValidation: false },
      "/abgabe/check": { triggerValidation: true },
    });

    const actual = getMetaConfigurationByStepId(flow, "/abgabe/check");

    expect(actual).toStrictEqual({
      excludedFromValidation: false,
      triggerValidation: true,
    });
  });

  it("prioritizes exact step values over parent values", () => {
    const flow = createFlow({
      "/abgabe": { excludedFromValidation: false, triggerValidation: true },
      "/abgabe/check2": {
        triggerValidation: false,
        excludedFromValidation: true,
      },
    });

    const actual = getMetaConfigurationByStepId(flow, "/abgabe/check2");

    expect(actual).toStrictEqual({
      excludedFromValidation: true,
      triggerValidation: false,
    });
  });

  it("falls back to nearest configured parent", () => {
    const flow = createFlow({
      "/abgabe": { excludedFromValidation: false },
      "/abgabe/check": { triggerValidation: true },
    });

    const actual = getMetaConfigurationByStepId(
      flow,
      "/abgabe/check/unknown-child",
    );

    expect(actual).toStrictEqual({
      excludedFromValidation: false,
      triggerValidation: true,
    });
  });

  it("accepts stepIds without a leading slash", () => {
    const flow = createFlow({
      "/abgabe": { excludedFromValidation: false },
    });

    const actual = getMetaConfigurationByStepId(flow, "abgabe");

    expect(actual).toStrictEqual({
      excludedFromValidation: false,
    });
  });

  it("should return only the parent configuration if it does not have in same level", () => {
    const flow = createFlow({
      "/abgabe": { excludedFromValidation: false },
      "/abgabe/check": { triggerValidation: true },
    });

    const actual = getMetaConfigurationByStepId(flow, "/abgabe/check2");

    expect(actual).toStrictEqual({
      excludedFromValidation: false,
    });
  });
});
