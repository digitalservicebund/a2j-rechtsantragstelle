import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "~/services/pdf/beratungshilfe/beratungshilfe.generated";
import {
  getOccupationDetails,
  getSelectedOptions,
  staatlicheLeistungMapping,
} from "../beratungshilfe.pdf";
import type { Attachment } from "../attachment";

export default function fillHeader(
  attachment: Attachment,
  context: BeratungshilfeFormularContext,
  {
    anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers,
    antragstellerNameVornameggfGeburtsname,
    berufErwerbstaetigkeit,
    geburtsdatumdesAntragstellers,
    tagsueberTelefonischerreichbarunterNummer,
  }: BeratungshilfePDF,
) {
  const hasStaatlicheLeistung =
    context.staatlicheLeistungen != "andereLeistung" &&
    context.staatlicheLeistungen != "keine";

  antragstellerNameVornameggfGeburtsname.value = [
    context.nachname,
    context.vorname,
  ]
    .filter((entry) => entry)
    .join(", ");
  geburtsdatumdesAntragstellers.value = context.geburtsdatum;
  anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers.value = [
    context.strasseHausnummer,
    context.plz,
    context.ort,
  ]
    .filter((entry) => entry)
    .join(", ");
  tagsueberTelefonischerreichbarunterNummer.value = context.telefonnummer;
  const occupationDetails = hasStaatlicheLeistung
    ? staatlicheLeistungMapping[context.staatlicheLeistungen ?? "keine"]
    : getOccupationDetails(context);
  berufErwerbstaetigkeit.value = occupationDetails;

  if (!hasStaatlicheLeistung && occupationDetails.length > 30) {
    attachment.descriptions.unshift({
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
    attachment.descriptions.unshift({
      title: "Beruf / Erwerbstätigkeit:",
      text: getOccupationDetails(context, false),
    });
  }
}
