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

const ehevertragNoticeComponent = {
  __component: "page.inline-notice",
  identifier: "ehevertragUnbekanntHinweis",
  title: "Erbanteile können nicht ermittelt werden",
};

// A married deceased whose Ehevertrag / Güterstand the user could not pin down.
const undeterminableSpouseUserData = {
  name: "Erblasser",
  familienstand: "verheiratet",
  ehepartnerName: "Ehepartner",
  ehevertrag: "unknown",
  hatteKinder: "yes",
  kinder: [{ name: "Kind Eins", isAlive: "yes" }],
  elternteile: [],
};

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

  it("hides the notice and shows the heirs when shares can be determined", async () => {
    const content = resultPageWith([
      heirsListComponent,
      ehevertragNoticeComponent,
    ]);

    const result = await erbfolgeResultExtras.transformContent!(
      content,
      contextFor("/ergebnis/erbfolge"),
    );

    expect(result.freeZone).toHaveLength(1);
    const list = result.freeZone[0] as unknown as {
      identifier: string;
      items: unknown[];
    };
    expect(list.identifier).toBe("heirsList");
    expect(list.items).toHaveLength(1);
  });

  it("hides the heirs and keeps the notice when the Ehevertrag is unknown", async () => {
    const content = resultPageWith([
      heirsListComponent,
      ehevertragNoticeComponent,
    ]);

    const result = await erbfolgeResultExtras.transformContent!(
      content,
      contextFor("/ergebnis/erbfolge", undeterminableSpouseUserData),
    );

    expect(result.freeZone).toHaveLength(1);
    expect(
      (result.freeZone[0] as unknown as { identifier: string }).identifier,
    ).toBe("ehevertragUnbekanntHinweis");
  });

  it("hides the heirs when the Güterstand is 'other'", async () => {
    const content = resultPageWith([
      heirsListComponent,
      ehevertragNoticeComponent,
    ]);

    const result = await erbfolgeResultExtras.transformContent!(
      content,
      contextFor("/ergebnis/erbfolge", {
        ...undeterminableSpouseUserData,
        ehevertrag: "yes",
        gueterstand: "other",
      }),
    );

    expect(result.freeZone).toHaveLength(1);
    expect(
      (result.freeZone[0] as unknown as { identifier: string }).identifier,
    ).toBe("ehevertragUnbekanntHinweis");
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
