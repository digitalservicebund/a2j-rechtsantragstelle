import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "../beratungshilfe.generated";

export function fillFooter(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const address = [
    context.anwaltName ?? "",
    context.anwaltStrasseUndHausnummer ?? "",
    context.anwaltPlz ?? "",
    context.anwaltOrt ?? "",
  ]
    .filter((entry) => entry)
    .join(", ");

  pdfFields.beratungsperson.value = address;
  pdfFields.datumBeratung.value = context.beratungStattgefundenDatum;
}
