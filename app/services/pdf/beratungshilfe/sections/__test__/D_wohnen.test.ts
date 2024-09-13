import { createAttachment } from "~/services/pdf/attachment";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { fillWohnen } from "~/services/pdf/beratungshilfe/sections/D_wohnen";

describe("fillWohnen", () => {
  it("should fill wohnen section for living situation alone correct", () => {
    const pdfFields = getBeratungshilfeParameters();

    fillWohnen([], pdfFields, {
      apartmentSizeSqm: 10,
      apartmentCostAlone: "100,00",
      livingSituation: "alone",
    });

    expect(pdfFields.d1Wohnung.value).toEqual("10");
    expect(pdfFields.d2Wohnkosten.value).toEqual("100,00");
    expect(pdfFields.d3Teilwohnkosten.value).toBeUndefined();
    expect(pdfFields.d4Wohnungalleine.value).toEqual(true);
    expect(pdfFields.d5Wohnunggemeinsam.value).toEqual(false);
    expect(pdfFields.d6WonungweiterePersonen.value).toBeUndefined();
  });

  const livingSituations = ["withRelatives", "withOthers"] as const;
  test.each(livingSituations)(
    "Fill Wohnen section for livingSituation %s",
    (livingSituation) => {
      const pdfFields = getBeratungshilfeParameters();
      const attachment = createAttachment();
      fillWohnen(attachment, pdfFields, {
        apartmentSizeSqm: 10,
        apartmentCostFull: "100",
        apartmentCostOwnShare: "20",
        apartmentPersonCount: 5,
        livingSituation,
      });

      expect(pdfFields.d1Wohnung.value).toEqual("10");
      expect(pdfFields.d2Wohnkosten.value).toEqual("100");
      expect(pdfFields.d3Teilwohnkosten.value).toEqual("su");
      expect(pdfFields.d4Wohnungalleine.value).toEqual(false);
      expect(pdfFields.d5Wohnunggemeinsam.value).toEqual(true);
      expect(pdfFields.d6WonungweiterePersonen.value).toEqual("5");
      expect(attachment[0]).toEqual({ title: "Feld D: Wohnen", level: "h2" });
      expect(attachment).toContainEqual({
        title: "Eigene Wohnungskosten (monatlich)",
        text: "20 €",
      });
    },
  );
});
