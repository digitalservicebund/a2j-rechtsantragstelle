import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { getBeratungshilfeParameters } from "~/services/pdf/beratungshilfe";
import { fillWohnen } from "~/services/pdf/beratungshilfe/sections/D_wohnen";

describe("fillWohnen", () => {
  it("should fill wohnen section for no data correctly", () => {
    const pdfFields = getBeratungshilfeParameters();

    fillWohnen(pdfFields, {});

    expect(pdfFields.d1Wohnung.value).toEqual("");
    expect(pdfFields.d2Wohnkosten.value).toEqual(undefined);
    expect(pdfFields.d3Teilwohnkosten.value).toEqual("");
    expect(pdfFields.d4Wohnungalleine.value).toEqual(undefined);
    expect(pdfFields.d5Wohnunggemeinsam.value).toEqual(false);
    expect(pdfFields.d6WonungweiterePersonen.value).toEqual("");
  });

  it("should fill wohnen section for living situation alone correct", () => {
    const context: BeratungshilfeFormularContext = {
      apartmentSizeSqm: 10,
      apartmentCostAlone: "100",
      livingSituation: "alone",
    };

    const pdfFields = getBeratungshilfeParameters();

    fillWohnen(pdfFields, context);

    expect(pdfFields.d1Wohnung.value).toEqual(
      context.apartmentSizeSqm?.toString(),
    );
    expect(pdfFields.d2Wohnkosten.value).toEqual(
      context.apartmentCostAlone?.toString(),
    );
    expect(pdfFields.d3Teilwohnkosten.value).toEqual("");
    expect(pdfFields.d4Wohnungalleine.value).toEqual(true);
    expect(pdfFields.d5Wohnunggemeinsam.value).toEqual(false);
    expect(pdfFields.d6WonungweiterePersonen.value).toEqual("");
  });

  it("should fill wohnen section for living situation withOthers correct", () => {
    const context: BeratungshilfeFormularContext = {
      apartmentSizeSqm: 10,
      apartmentCostFull: "100",
      apartmentCostOwnShare: "20",
      apartmentPersonCount: 5,
      livingSituation: "withOthers",
    };

    const pdfFields = getBeratungshilfeParameters();

    fillWohnen(pdfFields, context);

    expect(pdfFields.d1Wohnung.value).toEqual(
      context.apartmentSizeSqm?.toString(),
    );
    expect(pdfFields.d2Wohnkosten.value).toEqual(
      context.apartmentCostFull?.toString(),
    );
    expect(pdfFields.d3Teilwohnkosten.value).toEqual(
      context.apartmentCostOwnShare?.toString(),
    );
    expect(pdfFields.d4Wohnungalleine.value).toEqual(false);
    expect(pdfFields.d5Wohnunggemeinsam.value).toEqual(true);
    expect(pdfFields.d6WonungweiterePersonen.value).toEqual(
      context.apartmentPersonCount?.toString(),
    );
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

    expect(pdfFields.d1Wohnung.value).toEqual(
      context.apartmentSizeSqm?.toString(),
    );
    expect(pdfFields.d2Wohnkosten.value).toEqual(
      context.apartmentCostFull?.toString(),
    );
    expect(pdfFields.d3Teilwohnkosten.value).toEqual(
      context.apartmentCostOwnShare?.toString(),
    );
    expect(pdfFields.d4Wohnungalleine.value).toEqual(false);
    expect(pdfFields.d5Wohnunggemeinsam.value).toEqual(true);
    expect(pdfFields.d6WonungweiterePersonen.value).toEqual(
      context.apartmentPersonCount?.toString(),
    );
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
