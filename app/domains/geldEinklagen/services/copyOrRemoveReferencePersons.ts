import { updateSession } from "~/services/session.server";
import { type Session } from "react-router";
import { arrayIsNonEmpty } from "~/util/array";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../formular/klage-erstellen/userData";
import { getPageAndFlowDataFromPathname } from "~/services/flow/getPageAndFlowDataFromPathname";

type Abschnitte = Exclude<
  GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
  undefined
>;

type Personen = Exclude<Abschnitte[number]["personen"], undefined>[number];

const getReferencedPerson = (
  abschnitte: Abschnitte,
  reference: string,
): Personen | undefined => {
  const [sourceAbschnittIndex, sourcePersonIndex] = reference
    .split("-")
    .map(Number);

  return abschnitte[sourceAbschnittIndex]?.personen?.[sourcePersonIndex];
};

export const copyOrRemoveReferencePersons = async (
  request: Request,
  userData: GeldEinklagenFormularKlageErstellenUserData,
  flowSession: Session,
) => {
  const { pathname } = new URL(request.url.replaceAll(".data", ""));
  const { arrayIndexes } = getPageAndFlowDataFromPathname(pathname);

  const abschnitte = userData.abschnitte;

  if (!arrayIsNonEmpty(arrayIndexes) || !arrayIsNonEmpty(abschnitte)) {
    return;
  }

  const indexAbschnitt = arrayIndexes[0];
  const reuseBeweisePerson = abschnitte[indexAbschnitt]?.reuseBeweisePerson;

  if (!reuseBeweisePerson) {
    return;
  }

  let personen = abschnitte[indexAbschnitt].personen ?? [];

  for (const [reference, value] of Object.entries(reuseBeweisePerson)) {
    const alreadyCopied = personen.some(
      (person) =>
        person.personAuswahl === "anotherPerson" &&
        person.personReference === reference,
    );

    if (value === "on" && !alreadyCopied) {
      const referencedPerson = getReferencedPerson(abschnitte, reference);
      if (
        referencedPerson &&
        "personAuswahl" in referencedPerson &&
        referencedPerson.personAuswahl !== "beklagte" &&
        referencedPerson.personAuswahl !== "klagende"
      ) {
        const newPerson = {
          ...referencedPerson,
          personAuswahl: "anotherPerson" as const,
          personReference: reference,
        } as Personen;
        personen = [...personen, newPerson];
      }
    }

    if (value === "off" && alreadyCopied) {
      personen = personen.filter(
        (person) =>
          person.personAuswahl === "anotherPerson" &&
          person.personReference !== reference,
      );
    }
  }

  const updatedAbschnitte = [...abschnitte];
  updatedAbschnitte[indexAbschnitt] = {
    ...updatedAbschnitte[indexAbschnitt],
    personen,
  };

  // Replace the array wholesale instead of deep-merging, so removed
  // (shrunk) entries actually disappear rather than lingering from the
  // previously stored (longer) array.
  updateSession(flowSession, { abschnitte: updatedAbschnitte }, (_, newData) =>
    Array.isArray(newData) ? newData : undefined,
  );
};
