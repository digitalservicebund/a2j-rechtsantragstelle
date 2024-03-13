/**
 * @jest-environment node
 */

import { type BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { createAttachment } from "~/services/pdf/beratungshilfe/attachment";
import { fillUnterhalt } from "~/services/pdf/beratungshilfe/sections/E_unterhalt";

describe("E_unterhalt", () => {
  it("should fill unterhalt pdf fields when correct context is given", async () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
      zusammenleben: "yes",
      unterhalt: "yes",
      partnerVorname: "Donald",
      partnerNachname: "Duck",
      klageEingereicht: "yes",
      unterhaltsSumme: "1000",
    };
    const pdfFields = await getBeratungshilfeParameters();
    const attachment = createAttachment(context);

    fillUnterhalt(attachment, pdfFields, context);

    expect(pdfFields.e1Person1.value).toBe("Donald Duck");
    expect(pdfFields.e3Familienverhaeltnis.value).toBe("Partner:in");
    expect(pdfFields.e4Zahlung1.value).toBe("1000");

    expect(attachment.shouldCreateAttachment).toBe(true);
    expect(attachment.descriptions[0]).toEqual({
      title: "Unterhalt",
      text:
        "Unterhalt für Partner:in - Donald Duck\n" +
        "Gemeinsame Wohnung: Ja\n" +
        "Monatliche Summe: 1000 €",
    });
  });

  it("should fill kinder unterhalt pdf fields when correct context is given", async () => {
    const context: BeratungshilfeFormularContext = {
      partnerschaft: "yes",
      zusammenleben: "yes",
      unterhalt: "yes",
      partnerVorname: "Donald",
      partnerNachname: "Duck",
      klageEingereicht: "yes",
      unterhaltsSumme: "1000",
      kinder: [
        {
          eigeneEinnahmen: "yes",
          vorname: "Dagobert",
          nachname: "Duck",
          geburtsdatum: "01.01.2000",
          unterhaltsSumme: "500",
          einnahmen: "100",
          unterhalt: "yes",
          wohnortBeiAntragsteller: "yes",
        },
        {
          eigeneEinnahmen: "no",
          vorname: "Dagobert",
          nachname: "Daisy",
          geburtsdatum: "01.01.2001",
          unterhaltsSumme: "200",
          einnahmen: "0",
          unterhalt: "yes",
          wohnortBeiAntragsteller: "no",
        },
      ],
    };
    const pdfFields = await getBeratungshilfeParameters();
    const attachment = createAttachment(context);

    fillUnterhalt(attachment, pdfFields, context);

    expect(pdfFields.e1Person1.value).toBe("Donald Duck");
    expect(pdfFields.e3Familienverhaeltnis.value).toBe("Partner:in");
    expect(pdfFields.e4Zahlung1.value).toBe("1000");
    expect(pdfFields.e1Person2.value).toBe("Dagobert Duck");
    expect(pdfFields.e3Familienverhaeltnis2.value).toBe("Kind");
    expect(pdfFields.e4Zahlung2.value).toBe("500");
    expect(pdfFields.e5Einnahmen2.value).toBe(true);

    expect(attachment.shouldCreateAttachment).toBe(true);
    expect(attachment.descriptions[0]).toEqual({
      title: "Unterhalt",
      text:
        "Unterhalt für Partner:in - Donald Duck\n" +
        "Gemeinsame Wohnung: Ja\n" +
        "Monatliche Summe: 1000 €\n" +
        "\n" +
        "Unterhalt für Kind - Dagobert Duck\n" +
        "Gemeinsame Wohnung: Ja\n" +
        "Monatliche Summe: 500 €\n" +
        "\n" +
        "Unterhalt für Kind - Dagobert Daisy\n" +
        "Gemeinsame Wohnung: Ja\n" +
        "Monatliche Summe: 200 €",
    });
  });
});
