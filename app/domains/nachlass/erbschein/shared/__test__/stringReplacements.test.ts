import { erbfolgeStringReplacements } from "../stringReplacements";

type Context = Parameters<typeof erbfolgeStringReplacements>[0];

describe("erbfolgeStringReplacements", () => {
  it("spreads the raw answers so CMS text can reference them (e.g. {{verstorbeneVorname}})", () => {
    const result = erbfolgeStringReplacements({
      verstorbeneVorname: "Verstorbene",
      verstorbeneNachname: "Person",
      familienstand: "ledig",
      hatteKinder: "yes",
      kinder: [{ vorname: "Kind", nachname: "", isAlive: "yes" }],
      elternteile: [],
    } as Context);

    expect(result.verstorbeneVorname).toBe("Verstorbene");
    expect(result.verstorbeneNachname).toBe("Person");
    expect(result.familienstand).toBe("ledig");
  });

  it("lists a dead person who stated kids but added none as a missing child", () => {
    const result = erbfolgeStringReplacements({
      verstorbeneVorname: "Oma",
      hatteKinder: "yes",
      kinder: [],
      elternteile: [],
    } as Context);

    expect(result.missingChildrenNames).toBe("Oma");
    expect(result.missingChildrenNamesHtml).toBe("<ul><li>Oma</li></ul>");
  });

  it("collects missing children from the elternteile tree too", () => {
    const result = erbfolgeStringReplacements({
      verstorbeneVorname: "Erblasser",
      hatteKinder: "no",
      elternteile: [
        { vorname: "Vater", nachname: "", isAlive: "no", hatteKinder: "yes" },
      ],
    } as Context);

    expect(result.missingChildrenNames).toBe("Vater");
  });

  it("omits the missingChildren keys when nothing is missing", () => {
    const result = erbfolgeStringReplacements({
      verstorbeneVorname: "Erblasser",
      hatteKinder: "yes",
      kinder: [{ vorname: "Kind", nachname: "", isAlive: "yes" }],
      elternteile: [],
    } as Context);

    expect(result).not.toHaveProperty("missingChildrenNames");
    expect(result).not.toHaveProperty("missingChildrenNamesHtml");
  });

  it("marks hasMultipleHeirs when more than one heir inherits (Erbengemeinschaft)", () => {
    const result = erbfolgeStringReplacements({
      verstorbeneVorname: "Erblasser",
      hatteKinder: "yes",
      kinder: [
        { vorname: "Kind", nachname: "1", isAlive: "yes" },
        { vorname: "Kind", nachname: "2", isAlive: "yes" },
      ],
      elternteile: [],
    } as Context);

    expect(result.hasMultipleHeirs).toBe(true);
  });

  it("does not mark hasMultipleHeirs when a single heir inherits everything", () => {
    const result = erbfolgeStringReplacements({
      verstorbeneVorname: "Erblasser",
      hatteKinder: "yes",
      kinder: [{ vorname: "Kind", nachname: "1", isAlive: "yes" }],
      elternteile: [],
    } as Context);

    expect(result.hasMultipleHeirs).toBe(false);
  });

  it("exposes hasTestament for a will (handwritten or notarial), not for an Erbvertrag", () => {
    expect(
      erbfolgeStringReplacements({
        testamentArt: "handwritten",
      } as Context).hasTestament,
    ).toBe(true);
    expect(
      erbfolgeStringReplacements({
        testamentArt: "notarized",
      } as Context).hasTestament,
    ).toBe(true);
    expect(
      erbfolgeStringReplacements({
        testamentArt: "erbvertrag",
      } as Context).hasTestament,
    ).toBe(false);
  });

  it("exposes hasErbvertrag only for an Erbvertrag", () => {
    expect(
      erbfolgeStringReplacements({
        testamentArt: "erbvertrag",
      } as Context).hasErbvertrag,
    ).toBe(true);
    expect(
      erbfolgeStringReplacements({
        testamentArt: "handwritten",
      } as Context).hasErbvertrag,
    ).toBe(false);
  });

  it("escapes HTML in names for the raw-HTML placeholder", () => {
    const result = erbfolgeStringReplacements({
      verstorbeneVorname: "<b>Opa</b> & Co",
      hatteKinder: "yes",
      kinder: [],
      elternteile: [],
    } as Context);

    expect(result.missingChildrenNamesHtml).toBe(
      "<ul><li>&lt;b&gt;Opa&lt;/b&gt; &amp; Co</li></ul>",
    );
  });
});
