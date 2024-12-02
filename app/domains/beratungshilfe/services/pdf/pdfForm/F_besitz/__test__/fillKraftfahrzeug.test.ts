import { getBeratungshilfeParameters } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { SEE_IN_ATTACHMENT_DESCRIPTION } from "~/services/pdf/attachment";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";
import { fillKraftfahrzeug } from "../fillKraftfahrzeug";

describe("fillKraftfahrzeug", () => {
  it("should fill kraftfahrzeug pdf field when kraftfahrzeug is given in context", () => {
    const userData: BeratungshilfeFormularContext = {
      hasKraftfahrzeug: "yes",
      kraftfahrzeuge: [
        {
          eigentuemer: "partner",
          art: "P 50",
          marke: "Trabant",
          baujahr: "1990",
          kilometerstand: 999999,
          verkaufswert: "100000",
          hasArbeitsweg: "yes",
          wert: "over10000",
        },
      ],
    };
    const { pdfValues } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillKraftfahrzeug],
    });

    expect(pdfValues.f9Kraftfahrzeug1.value).toBe(false);
    expect(pdfValues.f9Kraftfahrzeuge2.value).toBe(true);
    expect(pdfValues.f10KraftfahrzeugeA.value).toBe(false);
    expect(pdfValues.f10KraftfahrzeugB.value).toBe(true);
    expect(pdfValues.f10KraftfahrzeugC.value).toBe(false);
    expect(pdfValues.f11Fahrzeugart.value).toBe(
      "Wird für Arbeitsweg gebraucht, Art: P 50, Marke: Trabant, Baujahr: 1990, Kilometerstand: 999999",
    );
    expect(pdfValues.f12Verkehrswert.value).toBe("100000 €");
  });

  it("should fill multiple kraftfahrzeug pdf field when kraftfahrzeug is given in context", () => {
    const userData: BeratungshilfeFormularContext = {
      hasKraftfahrzeug: "yes",
      kraftfahrzeuge: [
        {
          eigentuemer: "partner",
          art: "P 50",
          marke: "Trabant",
          anschaffungsjahr: "1985",
          baujahr: "1990",
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
          kilometerstand: 99999,
          verkaufswert: "10000",
          hasArbeitsweg: "yes",
          wert: "over10000",
        },
      ],
    };
    const { pdfValues, attachment } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillKraftfahrzeug],
    });

    expect(pdfValues.f9Kraftfahrzeug1.value).toBe(false);
    expect(pdfValues.f9Kraftfahrzeuge2.value).toBe(true);
    expect(pdfValues.f10KraftfahrzeugeA.value).toBe(undefined);
    expect(pdfValues.f10KraftfahrzeugB.value).toBe(undefined);
    expect(pdfValues.f10KraftfahrzeugC.value).toBe(undefined);
    expect(pdfValues.f11Fahrzeugart.value).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);
    expect(pdfValues.f12Verkehrswert.value).toBe(undefined);

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
    const userData: BeratungshilfeFormularContext = {
      hasKraftfahrzeug: "yes",
      kraftfahrzeuge: [
        {
          eigentuemer: "partner",
          art: "P 50",
          marke: "Trabant",
          anschaffungsjahr: "1985",
          baujahr: "1990",
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
          kilometerstand: 99999,
          verkaufswert: "10000",
          hasArbeitsweg: "yes",
          wert: "under10000",
        },
      ],
    };
    const { pdfValues, attachment } = pdfFillReducer({
      userData,
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillKraftfahrzeug],
    });

    expect(pdfValues.f9Kraftfahrzeug1.value).toBe(false);
    expect(pdfValues.f9Kraftfahrzeuge2.value).toBe(true);
    expect(pdfValues.f10KraftfahrzeugeA.value).toBe(undefined);
    expect(pdfValues.f10KraftfahrzeugB.value).toBe(undefined);
    expect(pdfValues.f10KraftfahrzeugC.value).toBe(undefined);
    expect(pdfValues.f11Fahrzeugart.value).toBe(SEE_IN_ATTACHMENT_DESCRIPTION);
    expect(pdfValues.f12Verkehrswert.value).toBe(undefined);

    expect(attachment[0]).toEqual({ title: "Kraftfahrzeuge", level: "h3" });
  });
});
