import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";

export function fillWohnen(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  pdfFields.d1Wohnung.value = context.apartmentSizeSqm?.toString();
  pdfFields.d2Wohnkosten.value =
    context.apartmentCostAlone ?? context.apartmentCostFull;

  // TODO: move to anhang
  pdfFields.d3Teilwohnkosten.value =
    context.apartmentCostOwnShare?.split(",")[0];

  const livesAlone = context.livingSituation === "alone";
  pdfFields.d4Wohnungalleine.value = livesAlone;
  pdfFields.d5Wohnunggemeinsam.value = !livesAlone;
  pdfFields.d6WonungweiterePersonen.value =
    context.apartmentPersonCount?.toString();
}
