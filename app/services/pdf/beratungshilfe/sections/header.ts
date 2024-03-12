import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import {
  getOccupationDetails,
  staatlicheLeistungMapping,
} from "../beratungshilfe.pdf";
import { checkboxListToString } from "../../checkboxListToString";
import { newPageHint, type Attachment } from "../attachment";

export default function fillHeader(
  attachment: Attachment,
  pdfFields: BeratungshilfePDF,
  context: BeratungshilfeFormularContext,
) {
  const hasStaatlicheLeistung =
    context.staatlicheLeistungen != "andereLeistung" &&
    context.staatlicheLeistungen != "keine";

  pdfFields.antragstellerNameVornameggfGeburtsname.value = [
    context.nachname,
    context.vorname,
  ]
    .filter((entry) => entry)
    .join(", ");
  pdfFields.geburtsdatumdesAntragstellers.value = context.geburtsdatum ?? "";
  pdfFields.anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers.value =
    [context.strasseHausnummer, context.plz, context.ort]
      .filter((entry) => entry)
      .join(", ");
  pdfFields.tagsueberTelefonischerreichbarunterNummer.value =
    context.telefonnummer ?? "";
  const occupationDetails = hasStaatlicheLeistung
    ? staatlicheLeistungMapping[context.staatlicheLeistungen ?? "keine"]
    : getOccupationDetails(context);
  pdfFields.berufErwerbstaetigkeit.value = occupationDetails;

  if (!hasStaatlicheLeistung && occupationDetails.length > 30) {
    attachment.descriptions.unshift({
      title: "Weiteres Einkommen:",
      text: checkboxListToString(
        {
          unterhaltszahlungen: "Unterhaltszahlungen",
          wohngeld: "Wohngeld",
          kindergeld: "Kindergeld",
          bafoeg: "Bafög",
          others: "Sonstiges",
        },
        context.weitereseinkommen,
      ),
    });
    attachment.descriptions.unshift({
      title: "Beruf / Erwerbstätigkeit:",
      text: getOccupationDetails(context, false),
    });
    pdfFields.berufErwerbstaetigkeit.value = newPageHint;
  }
}
