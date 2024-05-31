import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";

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
