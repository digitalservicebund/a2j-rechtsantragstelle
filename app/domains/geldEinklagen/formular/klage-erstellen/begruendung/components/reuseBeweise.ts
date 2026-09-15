import { arrayIsNonEmpty } from "~/util/array";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { hasPersonDetails } from "./BegruendungBeschreibungBeweisItems";

export const hasDocumentsToBeReusedFromOtherAbschnitte = (
  abschnitte: Exclude<
    GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
    undefined
  >,
  itemIndexAbschnitte: number,
) => {
  return abschnitte.some(
    (abschnitt, index) =>
      index !== itemIndexAbschnitte && arrayIsNonEmpty(abschnitt.dokumenten),
  );
};

export const hasPersonenToBeReusedFromOtherAbschnitte = (
  abschnitte: Exclude<
    GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
    undefined
  >,
  itemIndexAbschnitte: number,
) => {
  return abschnitte.some(
    ({ personen }, index) =>
      index !== itemIndexAbschnitte &&
      arrayIsNonEmpty(personen) &&
      personen.some((person) => hasPersonDetails(person)),
  );
};
