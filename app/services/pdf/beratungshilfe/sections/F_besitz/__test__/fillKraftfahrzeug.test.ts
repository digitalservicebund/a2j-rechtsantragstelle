import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { createAttachment, newPageHint } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { fillKraftfahrzeug } from "~/services/pdf/beratungshilfe/sections/F_besitz/fillKraftfahrzeug";

describe("fillKraftfahrzeug", () => {
  it("should fill kraftfahrzeug pdf field when kraftfahrzeug is given in context", () => {
    const context: BeratungshilfeFormularContext = {
      hasKraftfahrzeug: "yes",
      kraftfahrzeuge: [
        {
          eigentuemer: "partner",
          art: "P 50",
          marke: "Trabant",
          anschaffungsjahr: "1985",
          baujahr: "1990",
          bemerkung: "Bemerkung",
          kilometerstand: 999999,
          verkaufswert: "100000",
          hasArbeitsweg: "no",
          wert: "over10000",
        },
      ],
    };
    const pdfFields = getBeratungshilfeParameters();
    const attachment = createAttachment();

    fillKraftfahrzeug(attachment, pdfFields, context);

    expect(pdfFields.f9Kraftfahrzeug1.value).toBe(false);
    expect(pdfFields.f9Kraftfahrzeuge2.value).toBe(true);
    expect(pdfFields.f10KraftfahrzeugeA.value).toBe(false);
    expect(pdfFields.f10KraftfahrzeugB.value).toBe(true);
    expect(pdfFields.f10KraftfahrzeugC.value).toBe(false);
    expect(pdfFields.f11Fahrzeugart.value).toBe(
      "Wird nicht für Arbeitsweg gebraucht, Art: P 50, Marke: Trabant, Baujahr: 1990, Anschaffungsjahr: 1985, Kilometerstand: 999999",
    );
    expect(pdfFields.f12Verkehrswert.value).toBe("100000 €");
  });

  it("should fill multiple kraftfahrzeug pdf field when kraftfahrzeug is given in context", () => {
    const context: BeratungshilfeFormularContext = {
      hasKraftfahrzeug: "yes",
      kraftfahrzeuge: [
        {
          eigentuemer: "partner",
          art: "P 50",
          marke: "Trabant",
          anschaffungsjahr: "1985",
          baujahr: "1990",
          bemerkung: "Bemerkung",
          kilometerstand: 999999,
          verkaufswert: "100000",
          hasArbeitsweg: "yes",
          wert: "over10000",
        },
        {
          eigentuemer: "myself",
          art: "P 40",
          marke: "Trabbi",
          anschaffungsjahr: "1995",
          baujahr: "1988",
          bemerkung: "Bemerkung 2",
          kilometerstand: 99999,
          verkaufswert: "10000",
          hasArbeitsweg: "yes",
          wert: "over10000",
        },
      ],
    };
    const pdfFields = getBeratungshilfeParameters();
    const attachment = createAttachment();

    fillKraftfahrzeug(attachment, pdfFields, context);

    expect(pdfFields.f9Kraftfahrzeug1.value).toBe(false);
    expect(pdfFields.f9Kraftfahrzeuge2.value).toBe(true);
    expect(pdfFields.f10KraftfahrzeugeA.value).toBe(undefined);
    expect(pdfFields.f10KraftfahrzeugB.value).toBe(undefined);
    expect(pdfFields.f10KraftfahrzeugC.value).toBe(undefined);
    expect(pdfFields.f11Fahrzeugart.value).toBe(newPageHint);
    expect(pdfFields.f12Verkehrswert.value).toBe(undefined);

    expect(attachment[0]).toEqual({ title: "Kraftfahrzeuge", level: "h3" });
    expect(attachment).toContainEqual({ title: "Art", text: "P 40" });
    expect(attachment).toContainEqual({ title: "Marke", text: "Trabbi" });
    expect(attachment).toContainEqual({
      title: "Anschaffungsjahr",
      text: "1995",
    });
    expect(attachment).toContainEqual({ title: "Baujahr", text: "1988" });
    expect(attachment).toContainEqual({
      title: "Verkaufswert",
      text: "10000 €",
    });
    expect(attachment).toContainEqual({
      title: "Kilometerstand",
      text: "99999 km",
    });
    expect(attachment).toContainEqual({
      title: "Eigentümer:in",
      text: "Ich alleine",
    });
  });

  it("should fill multiple kraftfahrzeug data only with the hasArbeitsweg and not fill other data even they are filled in the context for wert under10000", () => {
    const context: BeratungshilfeFormularContext = {
      hasKraftfahrzeug: "yes",
      kraftfahrzeuge: [
        {
          eigentuemer: "partner",
          art: "P 50",
          marke: "Trabant",
          anschaffungsjahr: "1985",
          baujahr: "1990",
          bemerkung: "Bemerkung",
          kilometerstand: 999999,
          verkaufswert: "100000",
          hasArbeitsweg: "yes",
          wert: "under10000",
        },
        {
          eigentuemer: "myself",
          art: "P 40",
          marke: "Trabbi",
          anschaffungsjahr: "1995",
          baujahr: "1988",
          bemerkung: "Bemerkung 2",
          kilometerstand: 99999,
          verkaufswert: "10000",
          hasArbeitsweg: "yes",
          wert: "under10000",
        },
      ],
    };
    const pdfFields = getBeratungshilfeParameters();
    const attachment = createAttachment();

    fillKraftfahrzeug(attachment, pdfFields, context);

    expect(pdfFields.f9Kraftfahrzeug1.value).toBe(false);
    expect(pdfFields.f9Kraftfahrzeuge2.value).toBe(true);
    expect(pdfFields.f10KraftfahrzeugeA.value).toBe(undefined);
    expect(pdfFields.f10KraftfahrzeugB.value).toBe(undefined);
    expect(pdfFields.f10KraftfahrzeugC.value).toBe(undefined);
    expect(pdfFields.f11Fahrzeugart.value).toBe(newPageHint);
    expect(pdfFields.f12Verkehrswert.value).toBe(undefined);

    expect(attachment[0]).toEqual({ title: "Kraftfahrzeuge", level: "h3" });
  });
});
