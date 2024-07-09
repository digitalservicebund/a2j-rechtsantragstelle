import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import { uppercaseFirstLetter } from "~/util/strings";

export function fillFooter(
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  if (context.anwaltskanzlei === "yes") {
    if (context.beratungStattgefunden === "no") {
      pdfFields.beratungsperson.value =
        "Kontakt mit Kanzlei bereits aufgenommen, aber eine Beratung hat noch nicht stattgefunden";
    } else if (context.beratungStattgefunden === "yes") {
      pdfFields.beratungsperson.value = [
        context.anwaltName,
        context.anwaltStrasseUndHausnummer,
        context.anwaltPlz,
        context.anwaltOrt,
      ]
        .filter((entry) => entry)
        .join(", ");
      pdfFields.datumBeratung.value = context.beratungStattgefundenDatum ?? "";
    }
  }

  pdfFields.ortDatum2.value = `${uppercaseFirstLetter(context.ort)}, ${new Date().toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" })}`;

  if (context.abgabeArt === "online") {
    pdfFields.unterschriftdesAntragstellersderAntragstellerin.value = `${context.vorname ?? ""} ${context.nachname ?? ""}`;
  }
}
