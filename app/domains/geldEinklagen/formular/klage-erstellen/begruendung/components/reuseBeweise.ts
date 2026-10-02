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
      .map((dokument, dokumentIndex) => {
        return { ...dokument, dokumentIndex };
      })
      .filter((dokument) => !dokument.dokumentReference)
      .map((dokument) => ({
        label: dokument.beschreibung,
        option: `${abschnittIndex}-${dokument.dokumentIndex}`,
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
      .map((person, personIndex) => {
        return { ...person, personIndex };
      })
      .filter(
        (person) =>
          hasPersonDetails(person) &&
          person.personAuswahl === "anotherPerson" &&
          !person.personReference,
      )
      .map((person) => {
        const { label, labelBold } = getPersonLabels(person);
        return {
          labelBold,
          label,
          option: `${abschnittIndex}-${person.personIndex}`,
        };
      });
  });

export const hasPersonenToBeReusedFromOtherAbschnitte = (
  abschnitte: Abschnitte,
  itemIndexAbschnitte: number,
) =>
  getPersonenToBeReusedFromOtherAbschnitte(abschnitte, itemIndexAbschnitte)
    .length > 0;
