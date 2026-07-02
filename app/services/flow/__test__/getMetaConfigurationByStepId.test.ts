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

    expect(getMetaConfigurationByStepId(flow, "/abgabe/check")).toBeUndefined();
  });

  it("merges parent and exact step configuration", () => {
    const flow = createFlow({
      "/abgabe": { excludedFromValidation: false },
      "/abgabe/check": { triggerValidation: true },
    });

    expect(getMetaConfigurationByStepId(flow, "/abgabe/check")).toStrictEqual({
      excludedFromValidation: false,
      triggerValidation: true,
    });
  });

  it("keeps true values enabled even if child sets false", () => {
    const flow = createFlow({
      "/abgabe": { excludedFromValidation: false, triggerValidation: true },
      "/abgabe/check2": {
        triggerValidation: false,
        excludedFromValidation: true,
      },
    });

    expect(getMetaConfigurationByStepId(flow, "/abgabe/check2")).toStrictEqual({
      excludedFromValidation: true,
      triggerValidation: true,
    });
  });

  it("falls back to nearest configured parent", () => {
    const flow = createFlow({
      "/abgabe": { excludedFromValidation: false },
      "/abgabe/check": { triggerValidation: true },
    });

    expect(
      getMetaConfigurationByStepId(flow, "/abgabe/check/unknown-child"),
    ).toStrictEqual({
      excludedFromValidation: false,
      triggerValidation: true,
    });
  });

  it("accepts stepIds without a leading slash", () => {
    const flow = createFlow({
      "/abgabe": { excludedFromValidation: false },
    });

    expect(getMetaConfigurationByStepId(flow, "abgabe")).toStrictEqual({
      excludedFromValidation: false,
    });
  });
});
