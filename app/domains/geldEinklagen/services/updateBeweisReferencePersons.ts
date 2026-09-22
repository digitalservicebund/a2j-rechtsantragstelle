import { type Session } from "react-router";
import { updateSession } from "~/services/session.server";
import { getPageAndFlowDataFromPathname } from "~/services/flow/getPageAndFlowDataFromPathname";
import { arrayIsNonEmpty } from "~/util/array";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../formular/klage-erstellen/userData";
import { getPersonLocationsWithReference } from "./deleteBeweisPersonReference";
import assign from "lodash/assign";
import omit from "lodash/omit";

type Abschnitte = Exclude<
  GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
  undefined
>;

export const updateBeweisReferencePersons = async (
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

  const [abschnittIndex, personIndex] = arrayIndexes;
  const currentPerson = abschnitte[abschnittIndex]?.personen?.[personIndex];

  if (!currentPerson || currentPerson.personAuswahl !== "anotherPerson") {
    return;
  }

  // A copy points at the original via `dokumentReference`; the original is its own reference.
  const mainReference =
    currentPerson.personReference ?? `${abschnittIndex}-${personIndex}`;
  const [mainAbschnittIndex, mainPersonIndex] = mainReference
    .split("-")
    .map(Number);

  // Every other place holding this same document: the original itself, and any
  // other abschnitt that reuses it.
  const relatedLocations = [
    { abschnittIndex: mainAbschnittIndex, personIndex: mainPersonIndex },
    ...getPersonLocationsWithReference(abschnitte, mainReference),
  ].filter(
    (location) =>
      location.abschnittIndex !== abschnittIndex ||
      location.personIndex !== personIndex,
  );

  if (!arrayIsNonEmpty(relatedLocations)) {
    return;
  }

  const updatedAbschnitte: Abschnitte = structuredClone(abschnitte);

  relatedLocations.forEach((location) => {
    const person =
      updatedAbschnitte[location.abschnittIndex]?.personen?.[
        location.personIndex
      ];

    if (person && person.personAuswahl === "anotherPerson") {
      assign(person, omit(currentPerson, ["personAuswahl", "personReference"]));
    }
  });

  updateSession(flowSession, { abschnitte: updatedAbschnitte }, (_, newData) =>
    Array.isArray(newData) ? newData : undefined,
  );
};
