import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";

export function fillEinkommen(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  pdfFields.c2Einkuenftenetto.value = context.einkommen ?? "";

  if (
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "yes"
  ) {
    pdfFields.c3EinkuenftePartner.value = true;
    pdfFields.c4EinkuenftePartnernetto.value =
      context.partnerEinkommenSumme ?? "";
  }
}
