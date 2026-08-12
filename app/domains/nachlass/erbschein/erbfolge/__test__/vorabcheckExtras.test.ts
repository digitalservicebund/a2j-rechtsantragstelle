import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { nachlassErbfolgeStaticFlow } from "../flowConfig";
import { erbfolgeVorabcheckLoaderExtras } from "../vorabcheckExtras";
import { type LoaderExtrasContext } from "~/routes/shared/loaderExtras";

type UserData = Parameters<typeof createFlowSession>[1];

const FLOW_ID = "/nachlass/erbschein/erbfolge";

function contextFor(
  userData: UserData,
  stepId: string,
  arrayIndexes: number[] = [],
): LoaderExtrasContext {
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
  it("exposes the kinder list as array-summary data on the kinder overview page", () => {
    const context = contextFor(
      {
        verstorbeneVorname: "Erblasser",
        hatteKinder: "yes",
        kinder: [{ vorname: "Kind", nachname: "1", isAlive: "yes" }],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    const extra = erbfolgeVorabcheckLoaderExtras.buildLoaderData!({
      ...context,
      formElements: [],
    });

    expect(extra.arraySummaryData?.category).toBe("kinder");
    expect(extra.arraySummaryData?.arrayData.data).toHaveLength(1);
    expect(extra.deceasedPersonName).toBe("Erblasser");
  });

  it("exposes the elternteile list on the elternteile overview page", () => {
    const context = contextFor(
      {
        verstorbeneVorname: "Erblasser",
        hatteKinder: "no",
        elternteile: [{ vorname: "Mutter", nachname: "", isAlive: "yes" }],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/elternteile",
    );

    const extra = erbfolgeVorabcheckLoaderExtras.buildLoaderData!({
      ...context,
      formElements: [],
    });

    expect(extra.arraySummaryData?.category).toBe("elternteile");
  });

  it("returns no array-summary data on a non-array page", () => {
    const context = contextFor(
      { pageData: { arrayIndexes: [] } } as UserData,
      "/start",
    );

    const extra = erbfolgeVorabcheckLoaderExtras.buildLoaderData!({
      ...context,
      formElements: [],
    });

    expect(extra.arraySummaryData).toBeUndefined();
  });

  it("provides dynamic options for a parent-select field", () => {
    const context = contextFor(
      {
        verstorbeneVorname: "Erblasser",
        hatteKinder: "yes",
        kinder: [
          {
            vorname: "Kind",
            nachname: "Eins",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [{ vorname: "Enkel", nachname: "", isAlive: "yes" }],
          },
        ],
        elternteile: [],
        pageData: { arrayIndexes: [0, 0] },
      } as UserData,
      "/kinder/#/kinder/#/daten",
      [0, 0],
    );

    const extra = erbfolgeVorabcheckLoaderExtras.buildLoaderData!({
      ...context,
      formElements: [],
    });

    expect(extra.dynamicOptions).toHaveProperty(
      "kinder#kinder#parentKindIndex",
    );
  });
});

describe("erbfolgeVorabcheckExtras.buildReplacements", () => {
  it("resolves the ancestor list-item name for a nested page", () => {
    const context = contextFor(
      {
        verstorbeneVorname: "Erblasser",
        hatteKinder: "yes",
        kinder: [
          {
            vorname: "Kind",
            nachname: "Eins",
            isAlive: "no",
            hatteKinder: "yes",
            kinder: [{ vorname: "Enkel", nachname: "", isAlive: "yes" }],
          },
        ],
        elternteile: [],
        pageData: { arrayIndexes: [0, 0] },
      } as UserData,
      "/kinder/#/kinder/#/daten",
      [0, 0],
    );

    const replacements =
      erbfolgeVorabcheckLoaderExtras.buildReplacements!(context);

    expect(replacements["kinder#vorname"]).toBe("Kind");
    expect(replacements["kinder#nachname"]).toBe("Eins");
  });

  it("returns no ancestor names on a top-level page", () => {
    const context = contextFor(
      {
        verstorbeneVorname: "Erblasser",
        hatteKinder: "yes",
        kinder: [{ vorname: "Kind", nachname: "1", isAlive: "yes" }],
        elternteile: [],
        pageData: { arrayIndexes: [] },
      } as UserData,
      "/kinder",
    );

    const replacements =
      erbfolgeVorabcheckLoaderExtras.buildReplacements!(context);

    expect(replacements).toEqual({});
  });
});
