/**
 * @jest-environment node
 */

import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe/beratungshilfe.server";
import { fillPdf } from "~/services/pdf/beratungshilfe/sections/E_unterhalt/fillPdf";
import type { UnterhaltPdfField } from "~/services/pdf/beratungshilfe/sections/E_unterhalt/unterhaltPdfField";

describe("fillPdf", () => {
  it("it should fill the correct data to the pdf", async () => {
    const pdfFields = getBeratungshilfeParameters();

    const mockedGetListPersonUnterhaltPdfField: UnterhaltPdfField[] = [
      {
        name: "Donald Duck",
        familienverhaeltnis: "Partner:in",
        unterhaltSumme: "1000",
        hatEinnahmen: false,
        lebenZusammen: true,
      },
    ];

    const mockedGetListKidUnterhaltPdfField: UnterhaltPdfField[] = [
      {
        name: "Donald Kid",
        familienverhaeltnis: "Mein Kind",
        unterhaltSumme: "1000",
        hatEinnahmen: false,
        geburtsdatum: "10.10.2000",
      },
    ];

    fillPdf(
      mockedGetListPersonUnterhaltPdfField,
      mockedGetListKidUnterhaltPdfField,
      pdfFields,
    );

    expect(pdfFields.e1Person1.value).toBe(
      "Donald Kid (Gemeinsame Wohnung: Nein)",
    );
    expect(pdfFields.e2Geburtsdatum.value).toBe("10.10.2000");
    expect(pdfFields.e3Familienverhaeltnis.value).toBe("Mein Kind");
    expect(pdfFields.e4Zahlung1.value).toBe("1000 €");
    expect(pdfFields.e5Einnahmen1.value).toBe(true);

    expect(pdfFields.e1Person2.value).toBe("Donald Duck");
    expect(pdfFields.e3Familienverhaeltnis2.value).toBe("Partner:in");
    expect(pdfFields.e4Zahlung2.value).toBe("1000 €");
  });
});
