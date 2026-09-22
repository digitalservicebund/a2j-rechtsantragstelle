import { updateSession } from "~/services/session.server";
import { type Session } from "react-router";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../formular/klage-erstellen/userData";
import { arrayIsNonEmpty } from "~/util/array";

type Abschnitte = Exclude<
  GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
  undefined
>;

// Positions of persons that currently reuse (copy) a given original person reference.
export const getPersonLocationsWithReference = (
  abschnitte: Abschnitte,
  reference: string,
) =>
  abschnitte.flatMap((abschnitt, abschnittIndex) => {
    if (
      !abschnitt.reuseBeweisePerson ||
      abschnitt.reuseBeweisePerson[reference] !== "on" ||
      !arrayIsNonEmpty(abschnitt.personen)
    ) {
      return [];
    }

    return abschnitt.personen.flatMap((person, personIndex) =>
      person.personAuswahl === "anotherPerson" &&
      person.personReference === reference
        ? [{ abschnittIndex, personIndex }]
        : [],
    );
  });

export const deleteBeweisPersonReference = (
  flowSession: Session,
  arrayIndexes: number[],
) => {
  const abschnitte = (
    flowSession.data as GeldEinklagenFormularKlageErstellenUserData
  ).abschnitte;

  if (!arrayIsNonEmpty(arrayIndexes) || !arrayIsNonEmpty(abschnitte)) {
    return;
  }

  const [indexAbschnitt, indexPerson] = arrayIndexes;
  const currentPerson = abschnitte[indexAbschnitt]?.personen?.[indexPerson];

  if (currentPerson === undefined) {
    return;
  }

  const oldReference = `${indexAbschnitt}-${indexPerson}`;
  const updatedAbschnitte: Abschnitte = structuredClone(abschnitte);
  const currentAbschnitt = updatedAbschnitte[indexAbschnitt];

  // The person itself is removed afterwards by `deleteArrayItem`; this only fixes up references.

  // Once that removal happens, later persons in the same abschnitt shift one
  // index down, so any reference pointing at them becomes stale too.
  const referenceRenames = new Map<string, string | null>();
  const siblingCount = currentAbschnitt.personen?.length ?? 0;
  for (let i = indexPerson + 1; i < siblingCount; i++) {
    referenceRenames.set(
      `${indexAbschnitt}-${i}`,
      `${indexAbschnitt}-${i - 1}`,
    );
  }

  // The deleted person was itself a reused copy: switch its own abschnitt's flag off.
  const ownReuseBeweisePerson = currentAbschnitt.reuseBeweisePerson;
  if (
    currentPerson.personAuswahl === "anotherPerson" &&
    currentPerson.personReference &&
    ownReuseBeweisePerson &&
    ownReuseBeweisePerson[currentPerson.personReference] === "on"
  ) {
    ownReuseBeweisePerson[currentPerson.personReference] = "off";
  }

  // The deleted person was reused elsewhere as the "main" person: promote a replacement.
  const [mainLocation] = getPersonLocationsWithReference(
    updatedAbschnitte,
    oldReference,
  );

  if (mainLocation) {
    // `deleteArrayItem` runs afterwards and shifts indices after `indexPerson`
    // down within the same abschnitt, so the promoted person's final position
    // (and thus its new reference) must already reflect that shift.
    const finalPersonIndex =
      mainLocation.abschnittIndex === indexAbschnitt &&
      mainLocation.personIndex > indexPerson
        ? mainLocation.personIndex - 1
        : mainLocation.personIndex;
    const newReference = `${mainLocation.abschnittIndex}-${finalPersonIndex}`;
    const mainAbschnitt = updatedAbschnitte[mainLocation.abschnittIndex];
    const mainPerson = mainAbschnitt.personen?.[mainLocation.personIndex];

    if (mainPerson && mainPerson.personAuswahl === "anotherPerson") {
      mainPerson.personReference = undefined;
    }
    if (mainAbschnitt.reuseBeweisePerson) {
      delete mainAbschnitt.reuseBeweisePerson[oldReference];
    }

    // Other copies still pointing at the old reference get picked up below,
    // via the generic rename pass, since they're no longer the promoted one.
    referenceRenames.set(oldReference, newReference);
  } else {
    // No copy exists to take over: the person is gone for good, drop all traces of it.
    referenceRenames.set(oldReference, null);
  }

  // Apply the renames/removals to every person reference and reuse flag left in the tree.
  updatedAbschnitte.forEach((abschnitt) => {
    abschnitt.personen?.forEach((person) => {
      const reference =
        person.personAuswahl === "anotherPerson"
          ? person.personReference
          : undefined;
      if (
        !reference ||
        !referenceRenames.has(reference) ||
        person.personAuswahl !== "anotherPerson"
      ) {
        return;
      }
      person.personReference = referenceRenames.get(reference) ?? undefined;
    });

    const reuseBeweisePerson = abschnitt.reuseBeweisePerson;
    if (!reuseBeweisePerson) {
      return;
    }

    Object.keys(reuseBeweisePerson).forEach((reference) => {
      if (!referenceRenames.has(reference)) {
        return;
      }
      const value = reuseBeweisePerson[reference];
      const renamed = referenceRenames.get(reference);
      delete reuseBeweisePerson[reference];
      if (renamed) {
        reuseBeweisePerson[renamed] = value;
      }
    });

    // The schema requires at least one "on" entry, so drop the map entirely
    // once nothing is selected anymore instead of leaving only "off" values.
    if (!Object.values(reuseBeweisePerson).some((value) => value === "on")) {
      abschnitt.reuseBeweisePerson = undefined;
    }
  });

  // Replace the array wholesale instead of deep-merging, so removed
  // (shrunk) entries actually disappear rather than lingering from the
  // previously stored (longer) array.
  updateSession(flowSession, { abschnitte: updatedAbschnitte }, (_, newData) =>
    Array.isArray(newData) ? newData : undefined,
  );
};
