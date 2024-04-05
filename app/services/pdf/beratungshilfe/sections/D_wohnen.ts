import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";

export function fillWohnen(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  pdfFields.d1Wohnung.value = context.apartmentSizeSqm?.toString() ?? "";
  pdfFields.d2Wohnkosten.value = isLivingAlone(context)
    ? context.apartmentCostAlone
    : context.apartmentCostFull;
  pdfFields.d3Teilwohnkosten.value =
    isLivingAlone(context) ||
    typeof context.apartmentCostOwnShare === "undefined"
      ? ""
      : Math.round(
          Number(
            context.apartmentCostOwnShare.replace(/\./g, "").replace(",", "."),
          ),
        ).toString();
  pdfFields.d4Wohnungalleine.value = isLivingAlone(context);
  pdfFields.d5Wohnunggemeinsam.value = !isLivingAlone(context);
  pdfFields.d6WonungweiterePersonen.value = isLivingAlone(context)
    ? ""
    : context.apartmentPersonCount?.toString() ?? "";
}

function isLivingAlone(context: BeratungshilfeFormularContext): boolean {
  switch (context.livingSituation) {
    case "alone":
      return true;
    case "withOthers":
    case "withRelatives":
      return false;
    default:
      return false;
  }
}
