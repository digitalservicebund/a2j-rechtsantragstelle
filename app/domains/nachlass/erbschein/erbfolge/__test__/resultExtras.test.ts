import type { ResultExtrasContext } from "~/routes/shared/newEngineResult.server";
import type { StrapiResultPage } from "~/services/cms/models/StrapiResultPage";
import { erbfolgeResultExtras } from "../resultExtras";

// A deceased with a single living child: the child inherits everything, so the
// heir list has exactly one entry.
const singleChildUserData = {
  name: "Erblasser",
  familienstand: "ledig",
  hatteKinder: "yes",
  kinder: [{ name: "Kind Eins", isAlive: "yes" }],
  elternteile: [],
};

function contextFor(
  stepId: string,
  userData: Record<string, unknown> = singleChildUserData,
): ResultExtrasContext {
  return {
    request: new Request("http://localhost"),
    url: new URL("http://localhost"),
    flowId: "/nachlass/erbschein/erbfolge",
    stepId,
    userData: userData as ResultExtrasContext["userData"],
    flowSessionEngine: {} as ResultExtrasContext["flowSessionEngine"],
  };
}

function resultPageWith(freeZone: unknown[]): StrapiResultPage {
  return { freeZone } as unknown as StrapiResultPage;
}

const heirsListComponent = {
  __component: "page.list",
  identifier: "heirsList",
  items: [],
};

describe("erbfolgeResultExtras.buildReplacements", () => {
  it("injects the required-documents table on the main result page", async () => {
    const replacements = await erbfolgeResultExtras.buildReplacements!(
      contextFor("/ergebnis/erbfolge"),
    );

    expect(typeof replacements.requiredDocumentsHtml).toBe("string");
    expect(replacements.requiredDocumentsHtml).toContain("<table");
  });

  it("adds nothing on the other (not-determined) result pages", async () => {
    const replacements = await erbfolgeResultExtras.buildReplacements!(
      contextFor("/ergebnis/erbfolge-nicht-ermittelt-weitere-ordnungen"),
    );

    expect(replacements).toEqual({});
  });
});

describe("erbfolgeResultExtras.transformContent", () => {
  it("fills the heirsList CMS list with the calculated heirs on the main result page", async () => {
    const content = resultPageWith([heirsListComponent]);

    const result = await erbfolgeResultExtras.transformContent!(
      content,
      contextFor("/ergebnis/erbfolge"),
    );

    const list = result.freeZone[0] as unknown as { items: unknown[] };
    expect(list.items).toHaveLength(1);
  });

  it("leaves non-heirsList components untouched", async () => {
    const paragraph = { __component: "basic.paragraph", text: "unchanged" };
    const content = resultPageWith([paragraph]);

    const result = await erbfolgeResultExtras.transformContent!(
      content,
      contextFor("/ergebnis/erbfolge"),
    );

    expect(result.freeZone[0]).toEqual(paragraph);
  });

  it("does not touch content on the other result pages", async () => {
    const content = resultPageWith([heirsListComponent]);

    const result = await erbfolgeResultExtras.transformContent!(
      content,
      contextFor("/ergebnis/erbfolge-nicht-ermittelt-weitere-ordnungen"),
    );

    const list = result.freeZone[0] as unknown as { items: unknown[] };
    expect(list.items).toHaveLength(0);
  });
});
