import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/flows/beratungshilfeFormular";
import { pruneContext } from "~/flows/beratungshilfeFormular/finanzielleAngaben/context";

export function fillEinkommen(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const prunedContext = pruneContext(context);

  pdfFields.c2Einkuenftenetto.value = prunedContext.einkommen ?? "";

  pdfFields.c3EinkuenftePartner.value =
    prunedContext.partnerEinkommen === "yes";

  pdfFields.c4EinkuenftePartnernetto.value =
    prunedContext.partnerEinkommenSumme;
}
