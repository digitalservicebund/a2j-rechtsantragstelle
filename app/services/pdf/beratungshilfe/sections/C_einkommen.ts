import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";

export function fillEinkommen(
  pdfFields: BeratungshilfePDF,
  { einkommen, partnerEinkommenSumme }: BeratungshilfeFormularContext,
) {
  pdfFields.c2Einkuenftenetto.value = einkommen ?? "";
  pdfFields.c3EinkuenftePartner.value = partnerEinkommenSumme !== undefined;
  pdfFields.c4EinkuenftePartnernetto.value = partnerEinkommenSumme ?? "";
}
