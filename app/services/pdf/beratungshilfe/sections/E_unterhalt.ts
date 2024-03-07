import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";

export function fillUnterhalt(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  if (
    context.partnerschaft === "yes" &&
    context.zusammenleben === "no" &&
    context.unterhalt === "yes"
  ) {
    pdfFields.e1Person1.value = [
      context.partnerVorname ?? "",
      context.partnerNachname ?? "",
    ].join(" ");
    pdfFields.e3Familienverhaeltnis.value = "Partner:in";
    pdfFields.e4Zahlung1.value = context.unterhaltsSumme;
  }
}
