import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import type { VorabcheckExtrasContext } from "~/routes/shared/newEngineVorabcheck.server";
import { nachlassErbfolgeStaticFlow } from "../flowConfig";
import { erbfolgeVorabcheckExtras } from "../vorabcheckExtras";

type UserData = Parameters<typeof createFlowSession>[1];

const FLOW_ID = "/nachlass/erbschein/erbfolge";

function contextFor(
  userData: UserData,
  stepId: string,
  arrayIndexes: number[] = [],
): VorabcheckExtrasContext {
  const flowSessionEngine = createFlowSession(
    nachlassErbfolgeStaticFlow,
    userData,
    stepId,
  );
  const url = new URL(`http://localhost${FLOW_ID}${stepId}`);
  return {
    request: new Request(url),
    url,
    flowId: FLOW_ID,
    stepId,
    arrayIndexes,
    userData: {
      ...flowSessionEngine.prunedUserData,
      pageData: { arrayIndexes },
    },
    flowSessionEngine,
  };
}

describe("erbfolgeVorabcheckExtras.buildLoaderData", () => {
  it("exposes the kinder list as array-summary data on the kinder overview page", async () => {
    const context = contextFor(
      {
        name: "Erblasser",
        hatteKinder: "yes",
        kinder: [{ name: "Kind 1", isAlive: "yes" }],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    const extra = await erbfolgeVorabcheckExtras.buildLoaderData!({
      ...context,
      formElements: [],
    });

    expect(extra.arraySummaryData?.category).toBe("kinder");
    expect(extra.arraySummaryData?.arrayData.data).toHaveLength(1);
    expect(extra.deceasedPersonName).toBe("Erblasser");
  });

  it("exposes the elternteile list on the elternteile overview page", async () => {
    const context = contextFor(
      {
        name: "Erblasser",
        hatteKinder: "no",
        elternteile: [{ name: "Mutter", isAlive: "yes" }],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/elternteile",
    );

    const extra = await erbfolgeVorabcheckExtras.buildLoaderData!({
      ...context,
      formElements: [],
    });

    expect(extra.arraySummaryData?.category).toBe("elternteile");
  });

  it("returns no array-summary data on a non-array page", async () => {
    const context = contextFor(
      { pageData: { arrayIndexes: [] } } as UserData,
      "/start",
    );

    const extra = await erbfolgeVorabcheckExtras.buildLoaderData!({
      ...context,
      formElements: [],
    });

    expect(extra.arraySummaryData).toBeUndefined();
  });

  it("provides dynamic options for a parent-select field", async () => {
    const context = contextFor(
      {
        name: "Erblasser",
        hatteKinder: "yes",
        kinder: [
          {
            name: "Kind Eins",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [{ name: "Enkel", isAlive: "yes" }],
          },
        ],
        elternteile: [],
        pageData: { arrayIndexes: [0, 0] },
      } as UserData,
      "/kinder/#/kinder/#/daten",
      [0, 0],
    );

    const extra = await erbfolgeVorabcheckExtras.buildLoaderData!({
      ...context,
      formElements: [],
    });

    expect(extra.dynamicOptions).toHaveProperty(
      "kinder#kinder#parentKindIndex",
    );
  });
});

describe("erbfolgeVorabcheckExtras.buildReplacements", () => {
  it("resolves the ancestor list-item name for a nested page", async () => {
    const context = contextFor(
      {
        name: "Erblasser",
        hatteKinder: "yes",
        kinder: [
          {
            name: "Kind Eins",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [{ name: "Enkel", isAlive: "yes" }],
          },
        ],
        elternteile: [],
        pageData: { arrayIndexes: [0, 0] },
      } as UserData,
      "/kinder/#/kinder/#/daten",
      [0, 0],
    );

    const replacements =
      await erbfolgeVorabcheckExtras.buildReplacements!(context);

    expect(replacements["kinder#name"]).toBe("Kind Eins");
  });

  it("returns no ancestor names on a top-level page", async () => {
    const context = contextFor(
      {
        name: "Erblasser",
        hatteKinder: "yes",
        kinder: [{ name: "Kind 1", isAlive: "yes" }],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    const replacements =
      await erbfolgeVorabcheckExtras.buildReplacements!(context);

    expect(replacements).toEqual({});
  });
});
