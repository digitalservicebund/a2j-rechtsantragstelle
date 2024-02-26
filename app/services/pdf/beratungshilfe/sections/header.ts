import type { BeratungshilfeFormularContext } from "~/models/flows/beratungshilfeFormular";
import type { BeratungshilfePDF } from "~/services/pdf/beratungshilfe/beratungshilfe.generated";
import {
  getOccupationDetails,
  staatlicheLeistungMapping,
} from "../beratungshilfe.pdf";

export default function fillHeader(
  context: BeratungshilfeFormularContext,
  {
    anschriftStrasseHausnummerPostleitzahlWohnortdesAntragstellers,
    antragstellerNameVornameggfGeburtsname,
    berufErwerbstaetigkeit,
    geburtsdatumdesAntragstellers,
    tagsueberTelefonischerreichbarunterNummer,
  }: BeratungshilfePDF,
  hasStaatlicheLeistung: boolean,
) {
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
  berufErwerbstaetigkeit.value = hasStaatlicheLeistung
    ? staatlicheLeistungMapping[context.staatlicheLeistungen ?? "keine"]
    : getOccupationDetails(context);
}
