import { nachlassErbfolgeStringReplacements } from "../stringReplacements";

type Context = Parameters<typeof nachlassErbfolgeStringReplacements>[0];

describe("nachlassErbfolgeStringReplacements", () => {
  it("spreads the raw answers so CMS text can reference them (e.g. {{name}})", () => {
    const result = nachlassErbfolgeStringReplacements({
      name: "Verstorbene Person",
      familienstand: "ledig",
      hatteKinder: "yes",
      kinder: [{ name: "Kind", isAlive: "yes" }],
      elternteile: [],
    } as Context);

    expect(result.name).toBe("Verstorbene Person");
    expect(result.familienstand).toBe("ledig");
  });

  it("lists a dead person who stated kids but added none as a missing child", () => {
    const result = nachlassErbfolgeStringReplacements({
      name: "Oma",
      hatteKinder: "yes",
      kinder: [],
      elternteile: [],
    } as Context);

    expect(result.missingChildrenNames).toBe("Oma");
    expect(result.missingChildrenNamesHtml).toBe("<ul><li>Oma</li></ul>");
  });

  it("collects missing children from the elternteile tree too", () => {
    const result = nachlassErbfolgeStringReplacements({
      name: "Erblasser",
      hatteKinder: "no",
      elternteile: [{ name: "Vater", isAlive: "no", hatteKinder: "yes" }],
    } as Context);

    expect(result.missingChildrenNames).toBe("Vater");
  });

  it("omits the missingChildren keys when nothing is missing", () => {
    const result = nachlassErbfolgeStringReplacements({
      name: "Erblasser",
      hatteKinder: "yes",
      kinder: [{ name: "Kind", isAlive: "yes" }],
      elternteile: [],
    } as Context);

    expect(result).not.toHaveProperty("missingChildrenNames");
    expect(result).not.toHaveProperty("missingChildrenNamesHtml");
  });

  it("escapes HTML in names for the raw-HTML placeholder", () => {
    const result = nachlassErbfolgeStringReplacements({
      name: "<b>Opa</b> & Co",
      hatteKinder: "yes",
      kinder: [],
      elternteile: [],
    } as Context);

    expect(result.missingChildrenNamesHtml).toBe(
      "<ul><li>&lt;b&gt;Opa&lt;/b&gt; &amp; Co</li></ul>",
    );
  });
});
