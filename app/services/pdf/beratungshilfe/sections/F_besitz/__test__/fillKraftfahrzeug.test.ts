import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { createAttachment, newPageHint } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { fillKraftfahrzeug } from "~/services/pdf/beratungshilfe/sections/F_besitz/fillKraftfahrzeug";

const fahrzeugWirdFuerDenArbeitswegGenutzt =
  "Fahrzeug wird für den Arbeitsweg genutzt\n";
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
      "P 50, Trabant, Baujahr: 1990, km-Stand: 999999, Wird nicht für einen Arbeitsweg gebraucht",
    );
    expect(pdfFields.f12Verkehrswert.value).toBe("100000€");
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

    expect(attachment[0]).toEqual({
      title: "Kraftfahrzeuge",
      text:
        fahrzeugWirdFuerDenArbeitswegGenutzt +
        "Eigentümer:in: Ehe-Partner:in\n" +
        "Art des Fahrzeugs: P 50\n" +
        "Marke: Trabant\n" +
        "Anschaffungsjahr: 1985\n" +
        "Baujahr: 1990\n" +
        "Kilometerstand (ca.): 999999 km\n" +
        "Verkehrswert: 100000€\n" +
        "\n" +
        fahrzeugWirdFuerDenArbeitswegGenutzt +
        "Eigentümer:in: Ich alleine\n" +
        "Art des Fahrzeugs: P 40\n" +
        "Marke: Trabbi\n" +
        "Anschaffungsjahr: 1995\n" +
        "Baujahr: 1988\n" +
        "Kilometerstand (ca.): 99999 km\n" +
        "Verkehrswert: 10000€",
    });
  });

  it("should fill kraftfahrzeug1 as no when does not exists kraftfahrzeug in the context", () => {
    const context: BeratungshilfeFormularContext = {
      hasKraftfahrzeug: "no",
    };

    const pdfFields = getBeratungshilfeParameters();
    const attachment = createAttachment();

    fillKraftfahrzeug(attachment, pdfFields, context);

    expect(pdfFields.f9Kraftfahrzeug1.value).toBe(true);
    expect(pdfFields.f9Kraftfahrzeuge2.value).toBe(false);
  });

  it("should fill kraftfahrzeug data only with the hasArbeitsweg and not fill other data even they are filled in the context for wert under10000", () => {
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
          wert: "under10000",
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
      "Wird nicht für einen Arbeitsweg gebraucht",
    );
    expect(pdfFields.f12Verkehrswert.value).toBe("unter 10.000€");
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

    expect(attachment[0]).toEqual({
      title: "Kraftfahrzeuge",
      text:
        fahrzeugWirdFuerDenArbeitswegGenutzt +
        "Verkehrswert: unter 10.000€\n" +
        "\n" +
        fahrzeugWirdFuerDenArbeitswegGenutzt +
        "Verkehrswert: unter 10.000€",
    });
  });
});
