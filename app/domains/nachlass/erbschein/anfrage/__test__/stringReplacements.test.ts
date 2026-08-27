import { getAngehoerigeStrings } from "~/domains/nachlass/erbschein/anfrage/stringReplacements";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { type Kind } from "~/domains/nachlass/erbschein/shared/erbfolgeTypes";

describe("getAngehoerigeStrings", () => {
  it("builds a required-documents table (rendered on the result page)", () => {
    const result = getAngehoerigeStrings({
      verstorbeneVorname: "Erblasser",
      familienstand: "ledig",
      hatteKinder: "yes",
      kinder: [{ vorname: "Kind", nachname: "Eins", isAlive: "yes" }] as Kind[],
      elternteile: [],
    } as NachlassErbscheinAnfrageUserData);

    expect(result.requiredDocumentsHtml).toContain("<table");
    expect(result.requiredDocumentsHtml).toContain("Kind Eins");
  });
});
