import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";

export function fillFooter(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  pdfFields.beratungsperson.value = [
    context.anwaltName ?? "",
    context.anwaltStrasseUndHausnummer ?? "",
    context.anwaltPlz ?? "",
    context.anwaltOrt ?? "",
  ]
    .filter((entry) => entry)
    .join(", ");
  pdfFields.datumBeratung.value = context.beratungStattgefundenDatum ?? "";
}
