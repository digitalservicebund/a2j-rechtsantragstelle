import { arrayIsNonEmpty } from "~/util/array";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { hasPersonDetails } from "./BegruendungBeschreibungBeweisItems";

type Abschnitte = Exclude<
  GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
  undefined
>;

const isOtherAbschnitt = (index: number, itemIndexAbschnitte: number) =>
  index !== itemIndexAbschnitte;

export const getDocumentsToBeReusedFromOtherAbschnitte = (
  abschnitte: Abschnitte,
  itemIndexAbschnitte: number,
) =>
  abschnitte.flatMap((abschnitt, abschnittIndex) => {
    if (
      !isOtherAbschnitt(abschnittIndex, itemIndexAbschnitte) ||
      !arrayIsNonEmpty(abschnitt.dokumenten)
    ) {
      return [];
    }

    return abschnitt.dokumenten.map((dokument, documentIndex) => ({
      label: dokument.beschreibung,
      option: `${abschnittIndex}-${documentIndex}`,
    }));
  });

export const hasDocumentsToBeReusedFromOtherAbschnitte = (
  abschnitte: Abschnitte,
  itemIndexAbschnitte: number,
) =>
  getDocumentsToBeReusedFromOtherAbschnitte(abschnitte, itemIndexAbschnitte)
    .length > 0;

export const getPersonenToBeReusedFromOtherAbschnitte = (
  abschnitte: Abschnitte,
  itemIndexAbschnitte: number,
) =>
  abschnitte.flatMap((abschnitt, abschnittIndex) => {
    if (
      !isOtherAbschnitt(abschnittIndex, itemIndexAbschnitte) ||
      !arrayIsNonEmpty(abschnitt.personen)
    ) {
      return [];
    }

    return abschnitt.personen
      .map((person, personIndex) => ({ person, personIndex }))
      .filter(({ person }) => hasPersonDetails(person))
      .map(({ person, personIndex }) => ({
        labelBold: `${(person as { title: string }).title} ${(person as { vorname: string }).vorname} ${(person as { nachname: string }).nachname}`,
        label: `${(person as { strasse: string }).strasse} ${(person as { hausnummer: string }).hausnummer}, ${(person as { plz: string }).plz} ${(person as { ort: string }).ort}, ${(person as { land: string }).land}`,
        option: `${abschnittIndex}-${personIndex}`,
      }));
  });

export const hasPersonenToBeReusedFromOtherAbschnitte = (
  abschnitte: Abschnitte,
  itemIndexAbschnitte: number,
) =>
  getPersonenToBeReusedFromOtherAbschnitte(abschnitte, itemIndexAbschnitte)
    .length > 0;
