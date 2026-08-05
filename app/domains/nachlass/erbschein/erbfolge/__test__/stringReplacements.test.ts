import { nachlassErbfolgeStringReplacements } from "../stringReplacements";

type Context = Parameters<typeof nachlassErbfolgeStringReplacements>[0];

describe("nachlassErbfolgeStringReplacements", () => {
  it("spreads the raw answers so CMS text can reference them (e.g. {{verstorbeneVorname}})", () => {
    const result = nachlassErbfolgeStringReplacements({
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

  it("builds a required-documents table (rendered on the result page)", () => {
    const result = nachlassErbfolgeStringReplacements({
      verstorbeneVorname: "Erblasser",
      familienstand: "ledig",
      hatteKinder: "yes",
      kinder: [{ vorname: "Kind", nachname: "Eins", isAlive: "yes" }],
      elternteile: [],
    } as Context);

    expect(result.requiredDocumentsHtml).toContain("<table");
    expect(result.requiredDocumentsHtml).toContain("Kind Eins");
  });

  it("lists a dead person who stated kids but added none as a missing child", () => {
    const result = nachlassErbfolgeStringReplacements({
      verstorbeneVorname: "Oma",
      hatteKinder: "yes",
      kinder: [],
      elternteile: [],
    } as Context);

    expect(result.missingChildrenNames).toBe("Oma");
    expect(result.missingChildrenNamesHtml).toBe("<ul><li>Oma</li></ul>");
  });

  it("collects missing children from the elternteile tree too", () => {
    const result = nachlassErbfolgeStringReplacements({
      verstorbeneVorname: "Erblasser",
      hatteKinder: "no",
      elternteile: [
        { vorname: "Vater", nachname: "", isAlive: "no", hatteKinder: "yes" },
      ],
    } as Context);

    expect(result.missingChildrenNames).toBe("Vater");
  });

  it("omits the missingChildren keys when nothing is missing", () => {
    const result = nachlassErbfolgeStringReplacements({
      verstorbeneVorname: "Erblasser",
      hatteKinder: "yes",
      kinder: [{ vorname: "Kind", nachname: "", isAlive: "yes" }],
      elternteile: [],
    } as Context);

    expect(result).not.toHaveProperty("missingChildrenNames");
    expect(result).not.toHaveProperty("missingChildrenNamesHtml");
  });

  it("marks hasMultipleHeirs when more than one heir inherits (Erbengemeinschaft)", () => {
    const result = nachlassErbfolgeStringReplacements({
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
    const result = nachlassErbfolgeStringReplacements({
      verstorbeneVorname: "Erblasser",
      hatteKinder: "yes",
      kinder: [{ vorname: "Kind", nachname: "1", isAlive: "yes" }],
      elternteile: [],
    } as Context);

    expect(result.hasMultipleHeirs).toBe(false);
  });

  it("escapes HTML in names for the raw-HTML placeholder", () => {
    const result = nachlassErbfolgeStringReplacements({
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
