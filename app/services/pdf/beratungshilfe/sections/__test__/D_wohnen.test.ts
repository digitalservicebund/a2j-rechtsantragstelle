import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { fillWohnen } from "~/services/pdf/beratungshilfe/sections/D_wohnen";

describe("fillWohnen", () => {
  it("should fill wohnen section for living situation alone correct", () => {
    const context = {
      apartmentSizeSqm: 10,
      apartmentCostAlone: "100,00",
      livingSituation: "alone",
    } satisfies BeratungshilfeFormularContext;

    const pdfFields = getBeratungshilfeParameters();

    fillWohnen(pdfFields, context);

    expect(pdfFields.d1Wohnung.value).toEqual("10");
    expect(pdfFields.d2Wohnkosten.value).toEqual("100,00");
    expect(pdfFields.d3Teilwohnkosten.value).toBeUndefined();
    expect(pdfFields.d4Wohnungalleine.value).toEqual(true);
    expect(pdfFields.d5Wohnunggemeinsam.value).toEqual(false);
    expect(pdfFields.d6WonungweiterePersonen.value).toBeUndefined();
  });

  it("should fill wohnen section for living situation withOthers correct", () => {
    const context = {
      apartmentSizeSqm: 10,
      apartmentCostFull: "100",
      apartmentCostOwnShare: "20",
      apartmentPersonCount: 5,
      livingSituation: "withOthers",
    } satisfies BeratungshilfeFormularContext;

    const pdfFields = getBeratungshilfeParameters();

    fillWohnen(pdfFields, context);

    expect(pdfFields.d1Wohnung.value).toEqual("10");
    expect(pdfFields.d2Wohnkosten.value).toEqual("100");
    expect(pdfFields.d3Teilwohnkosten.value).toEqual("20");
    expect(pdfFields.d4Wohnungalleine.value).toEqual(false);
    expect(pdfFields.d5Wohnunggemeinsam.value).toEqual(true);
    expect(pdfFields.d6WonungweiterePersonen.value).toEqual("5");
  });

  it("should fill wohnen section for living situation withRelatives correct", () => {
    const context: BeratungshilfeFormularContext = {
      apartmentSizeSqm: 10,
      apartmentCostFull: "100",
      apartmentCostOwnShare: "20",
      apartmentPersonCount: 5,
      livingSituation: "withRelatives",
    };

    const pdfFields = getBeratungshilfeParameters();

    fillWohnen(pdfFields, context);

    expect(pdfFields.d1Wohnung.value).toEqual("10");
    expect(pdfFields.d2Wohnkosten.value).toEqual("100");
    expect(pdfFields.d3Teilwohnkosten.value).toEqual("20");
    expect(pdfFields.d4Wohnungalleine.value).toEqual(false);
    expect(pdfFields.d5Wohnunggemeinsam.value).toEqual(true);
    expect(pdfFields.d6WonungweiterePersonen.value).toEqual("5");
  });

  it("should should round cost own share", () => {
    const context: BeratungshilfeFormularContext = {
      apartmentSizeSqm: 10,
      apartmentCostFull: "100",
      apartmentCostOwnShare: "20,20",
      apartmentPersonCount: 5,
      livingSituation: "withRelatives",
    };

    const pdfFields = getBeratungshilfeParameters();

    fillWohnen(pdfFields, context);

    expect(pdfFields.d3Teilwohnkosten.value).toEqual("20");
  });
});
