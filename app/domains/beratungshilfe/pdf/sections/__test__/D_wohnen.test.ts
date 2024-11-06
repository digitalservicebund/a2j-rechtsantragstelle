import { getBeratungshilfeParameters } from "~/domains/beratungshilfe/pdf";
import { fillWohnen } from "~/domains/beratungshilfe/pdf/sections/D_wohnen";
import { pdfFillReducer } from "~/services/pdf/fillOutFunction";

describe("fillWohnen", () => {
  it("should fill wohnen section for living situation alone correct", () => {
    const { pdfValues } = pdfFillReducer({
      userData: {
        apartmentSizeSqm: 10,
        apartmentCostAlone: "100,00",
        livingSituation: "alone",
      },
      pdfParams: getBeratungshilfeParameters(),
      fillFunctions: [fillWohnen],
    });

    expect(pdfValues.d1Wohnung.value).toEqual("10");
    expect(pdfValues.d2Wohnkosten.value).toEqual("100,00");
    expect(pdfValues.d3Teilwohnkosten.value).toBeUndefined();
    expect(pdfValues.d4Wohnungalleine.value).toEqual(true);
    expect(pdfValues.d5Wohnunggemeinsam.value).toEqual(false);
    expect(pdfValues.d6WonungweiterePersonen.value).toBeUndefined();
  });

  const livingSituations = ["withRelatives", "withOthers"] as const;
  test.each(livingSituations)(
    "Fill Wohnen section for livingSituation %s",
    (livingSituation) => {
      const { pdfValues, attachment } = pdfFillReducer({
        userData: {
          apartmentSizeSqm: 10,
          apartmentCostFull: "100",
          apartmentCostOwnShare: "20",
          apartmentPersonCount: 5,
          livingSituation,
        },
        pdfParams: getBeratungshilfeParameters(),
        fillFunctions: [fillWohnen],
      });

      expect(pdfValues.d1Wohnung.value).toEqual("10");
      expect(pdfValues.d2Wohnkosten.value).toEqual("s. Anhang");
      expect(pdfValues.d4Wohnungalleine.value).toEqual(false);
      expect(pdfValues.d5Wohnunggemeinsam.value).toEqual(true);
      expect(pdfValues.d6WonungweiterePersonen.value).toEqual("5");
      expect(attachment[0]).toEqual({ title: "Feld D: Wohnen", level: "h2" });
      expect(attachment).toContainEqual({
        title: "Eigene Wohnungskosten (monatlich)",
        text: "20 €",
      });
    },
  );
});
