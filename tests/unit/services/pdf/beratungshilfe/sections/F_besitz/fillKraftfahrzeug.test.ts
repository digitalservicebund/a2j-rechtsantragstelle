/**
 * @jest-environment node
 */

import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import {
  createAttachment,
  newPageHint,
} from "~/services/pdf/beratungshilfe/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { fillKraftfahrzeug } from "~/services/pdf/beratungshilfe/sections/F_besitz/fillKraftfahrzeug";

describe("fillKraftfahrzeug", () => {
  it("should fill kraftfahrzeug pdf field when kraftfahrzeug is given in context", async () => {
    const context: BeratungshilfeFormularContext = {
      kraftfahrzeuge: [
        {
          eigentuemer: "partner",
          art: "P 50",
          marke: "Trabant",
          anschaffungsjahr: "1985",
          baujahr: "1990",
          bemerkung: "Bemerkung",
          kilometerstand: "999999",
          verkaufswert: "100000",
          hasArbeitsweg: "no",
          wert: "over10000",
        },
      ],
    };
    const pdfFields = await getBeratungshilfeParameters();
    const attachment = createAttachment(context);

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

    expect(attachment.shouldCreateAttachment).toBe(false);
  });

  it("should fill multiple kraftfahrzeug pdf field when kraftfahrzeug is given in context", async () => {
    const context: BeratungshilfeFormularContext = {
      kraftfahrzeuge: [
        {
          eigentuemer: "partner",
          art: "P 50",
          marke: "Trabant",
          anschaffungsjahr: "1985",
          baujahr: "1990",
          bemerkung: "Bemerkung",
          kilometerstand: "999999",
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
          kilometerstand: "99999",
          verkaufswert: "10000",
          hasArbeitsweg: "yes",
          wert: "over10000",
        },
      ],
    };
    const pdfFields = await getBeratungshilfeParameters();
    const attachment = createAttachment(context);

    fillKraftfahrzeug(attachment, pdfFields, context);

    expect(pdfFields.f9Kraftfahrzeug1.value).toBe(false);
    expect(pdfFields.f9Kraftfahrzeuge2.value).toBe(true);
    expect(pdfFields.f10KraftfahrzeugeA.value).toBe(false);
    expect(pdfFields.f10KraftfahrzeugB.value).toBe(false);
    expect(pdfFields.f10KraftfahrzeugC.value).toBe(false);
    expect(pdfFields.f11Fahrzeugart.value).toBe(newPageHint);
    expect(pdfFields.f12Verkehrswert.value).toBe(undefined);

    expect(attachment.shouldCreateAttachment).toBe(true);
    expect(attachment.descriptions[0]).toEqual({
      title: "Kraftfahrzeuge",
      text:
        "Fahrzeug wird für den Arbeitsweg genutzt\n" +
        "Eigentümer:in: Ehe-Partner:in\n" +
        "Art des Fahrzeugs: P 50\n" +
        "Marke: Trabant\n" +
        "Anschaffungsjahr: 1985\n" +
        "Baujahr: 1990\n" +
        "Kilometerstand (ca.): 999999 km\n" +
        "Verkehrswert: 100000€\n" +
        "\n" +
        "Fahrzeug wird für den Arbeitsweg genutzt\n" +
        "Eigentümer:in: Ich alleine\n" +
        "Art des Fahrzeugs: P 40\n" +
        "Marke: Trabbi\n" +
        "Anschaffungsjahr: 1995\n" +
        "Baujahr: 1988\n" +
        "Kilometerstand (ca.): 99999 km\n" +
        "Verkehrswert: 10000€",
    });
  });

  it("should fill kraftfahrzeug1 as no when does not exists kraftfahrzeug in the context", async () => {
    const context: BeratungshilfeFormularContext = {
      kraftfahrzeuge: [],
    };

    const pdfFields = await getBeratungshilfeParameters();
    const attachment = createAttachment(context);

    fillKraftfahrzeug(attachment, pdfFields, context);

    expect(pdfFields.f9Kraftfahrzeug1.value).toBe(true);
    expect(pdfFields.f9Kraftfahrzeuge2.value).toBe(false);
  });
});
