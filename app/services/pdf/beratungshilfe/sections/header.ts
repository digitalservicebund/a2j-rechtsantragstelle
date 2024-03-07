import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "data/pdf/beratungshilfe/beratungshilfe.generated";
import {
  getOccupationDetails,
  getSelectedOptions,
  staatlicheLeistungMapping,
} from "../beratungshilfe.pdf";
import type { DescriptionField } from "../descriptionField";

export default function fillHeader(
  descriptionField: DescriptionField,
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
  pdfFields.geburtsdatumdesAntragstellers.value = context.geburtsdatum;
  pdfFields.anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers.value =
    [context.strasseHausnummer, context.plz, context.ort]
      .filter((entry) => entry)
      .join(", ");
  pdfFields.tagsueberTelefonischerreichbarunterNummer.value =
    context.telefonnummer;
  const occupationDetails = hasStaatlicheLeistung
    ? staatlicheLeistungMapping[context.staatlicheLeistungen ?? "keine"]
    : getOccupationDetails(context);
  pdfFields.berufErwerbstaetigkeit.value = occupationDetails;

  if (!hasStaatlicheLeistung && occupationDetails.length > 30) {
    descriptionField.descriptions.unshift({
      title: "Weiteres Einkommen:",
      text: getSelectedOptions(
        {
          unterhaltszahlungen: "Unterhaltszahlungen",
          wohngeld: "Wohngeld",
          kindergeld: "Kindergeld",
          bafoeg: "Bafög",
          others: "Sonstiges",
        },
        context.weitereseinkommen ?? {},
      ),
    });
    descriptionField.descriptions.unshift({
      title: "Beruf / Erwerbstätigkeit:",
      text: getOccupationDetails(context, false),
    });
  }
}
