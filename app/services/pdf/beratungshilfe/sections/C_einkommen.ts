import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";

export function fillEinkommen(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  pdfFields.c2Einkuenftenetto.value = context.einkommen;

  if (
    context.partnerschaft === "yes" &&
    context.zusammenleben === "yes" &&
    context.partnerEinkommen === "yes"
  ) {
    pdfFields.c3EinkuenftePartner.value = true;
    pdfFields.c4EinkuenftePartnernetto.value = context.partnerEinkommenSumme;
  }
}
