import { arrayIsNonEmpty } from "~/util/array";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../../userData";
import { hasPersonDetails } from "./BegruendungBeschreibungBeweisItems";
import capitalize from "lodash/capitalize";

export type Abschnitte = Exclude<
  GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
  undefined
>;

const getPersonLabels = (
  person: Exclude<Abschnitte[number]["personen"], undefined>[number],
) => {
  if (person.personAuswahl !== "anotherPerson") {
    return {
      labelBold: "",
      label: "",
    };
  }

  const anrede = person.anrede === "none" ? "" : capitalize(person.anrede);

  return {
    labelBold: `${person.title} ${anrede} ${person.vorname} ${person.nachname}`,
    label: `${person.strasse} ${person.hausnummer}, ${person.plz} ${person.ort}, ${person.land}`,
  };
};

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

    return abschnitt.dokumenten
      .filter((dokument) => !dokument.dokumentReference)
      .map((dokument, documentIndex) => ({
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
      .filter(
        ({ person }) => hasPersonDetails(person) && !person.personReference,
      )
      .map(({ person, personIndex }) => {
        const { label, labelBold } = getPersonLabels(person);
        return {
          labelBold,
          label,
          option: `${abschnittIndex}-${personIndex}`,
        };
      });
  });

export const hasPersonenToBeReusedFromOtherAbschnitte = (
  abschnitte: Abschnitte,
  itemIndexAbschnitte: number,
) =>
  getPersonenToBeReusedFromOtherAbschnitte(abschnitte, itemIndexAbschnitte)
    .length > 0;
