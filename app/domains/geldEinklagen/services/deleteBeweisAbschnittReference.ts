import { updateSession } from "~/services/session.server";
import { type Session } from "react-router";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../formular/klage-erstellen/userData";
import { arrayIsNonEmpty } from "~/util/array";
import { getDokumentLocationsWithReference } from "./deleteBeweisDokumentReference";
import { getPersonLocationsWithReference } from "./deleteBeweisPersonReference";

type Abschnitte = Exclude<
  GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
  undefined
>;

// Any reference into a later abschnitt shifts its abschnitt index down by one
// once the deleted abschnitt is spliced out (by `deleteArrayItem`, afterwards).
const shiftReference = (reference: string, indexAbschnitt: number) => {
  const [abschnittIndexPart, itemIndexPart] = reference.split("-");
  const abschnittIndex = Number(abschnittIndexPart);
  return abschnittIndex > indexAbschnitt
    ? `${abschnittIndex - 1}-${itemIndexPart}`
    : reference;
};

const fixDokumentReferences = (
  updatedAbschnitte: Abschnitte,
  indexAbschnitt: number,
) => {
  const deletedAbschnitt = updatedAbschnitte[indexAbschnitt];
  const documentCount = deletedAbschnitt.dokumenten?.length ?? 0;

  // Documents that lived in the deleted abschnitt either get a replacement
  // promoted from wherever they were reused, or disappear for good.
  const referenceRenames = new Map<string, string | null>();

  for (let dokumentIndex = 0; dokumentIndex < documentCount; dokumentIndex++) {
    const oldReference = `${indexAbschnitt}-${dokumentIndex}`;
    const [mainLocation] = getDokumentLocationsWithReference(
      updatedAbschnitte,
      oldReference,
    );

    if (mainLocation) {
      const newReference = shiftReference(
        `${mainLocation.abschnittIndex}-${mainLocation.dokumentIndex}`,
        indexAbschnitt,
      );
      const mainAbschnitt = updatedAbschnitte[mainLocation.abschnittIndex];
      const mainDokument =
        mainAbschnitt.dokumenten?.[mainLocation.dokumentIndex];

      if (mainDokument) {
        mainDokument.dokumentReference = undefined;
      }
      if (mainAbschnitt.reuseBeweiseDokument) {
        delete mainAbschnitt.reuseBeweiseDokument[oldReference];
      }

      referenceRenames.set(oldReference, newReference);
    } else {
      referenceRenames.set(oldReference, null);
    }
  }

  const resolveReference = (reference: string) =>
    referenceRenames.has(reference)
      ? referenceRenames.get(reference)
      : shiftReference(reference, indexAbschnitt);

  updatedAbschnitte.forEach((abschnitt, abschnittIndex) => {
    if (abschnittIndex === indexAbschnitt) {
      return;
    }

    abschnitt.dokumenten?.forEach((dokument) => {
      const reference = dokument.dokumentReference;
      if (!reference) {
        return;
      }
      dokument.dokumentReference = resolveReference(reference) ?? undefined;
    });

    const reuseBeweiseDokument = abschnitt.reuseBeweiseDokument;
    if (!reuseBeweiseDokument) {
      return;
    }

    Object.keys(reuseBeweiseDokument).forEach((reference) => {
      const renamed = resolveReference(reference);
      if (renamed === reference) {
        return;
      }
      const value = reuseBeweiseDokument[reference];
      delete reuseBeweiseDokument[reference];
      if (renamed) {
        reuseBeweiseDokument[renamed] = value;
      }
    });

    // The schema requires at least one "on" entry, so drop the map entirely
    // once nothing is selected anymore instead of leaving only "off" values.
    if (!Object.values(reuseBeweiseDokument).some((value) => value === "on")) {
      abschnitt.reuseBeweiseDokument = undefined;
    }
  });
};

const fixPersonReferences = (
  updatedAbschnitte: Abschnitte,
  indexAbschnitt: number,
) => {
  const deletedAbschnitt = updatedAbschnitte[indexAbschnitt];
  const personCount = deletedAbschnitt.personen?.length ?? 0;

  // Persons that lived in the deleted abschnitt either get a replacement
  // promoted from wherever they were reused, or disappear for good.
  const referenceRenames = new Map<string, string | null>();

  for (let personIndex = 0; personIndex < personCount; personIndex++) {
    const oldReference = `${indexAbschnitt}-${personIndex}`;
    const [mainLocation] = getPersonLocationsWithReference(
      updatedAbschnitte,
      oldReference,
    );

    if (mainLocation) {
      const newReference = shiftReference(
        `${mainLocation.abschnittIndex}-${mainLocation.personIndex}`,
        indexAbschnitt,
      );
      const mainAbschnitt = updatedAbschnitte[mainLocation.abschnittIndex];
      const mainPerson = mainAbschnitt.personen?.[mainLocation.personIndex];

      if (mainPerson && mainPerson.personAuswahl === "anotherPerson") {
        mainPerson.personReference = undefined;
      }
      if (mainAbschnitt.reuseBeweisePerson) {
        delete mainAbschnitt.reuseBeweisePerson[oldReference];
      }

      referenceRenames.set(oldReference, newReference);
    } else {
      referenceRenames.set(oldReference, null);
    }
  }

  const resolveReference = (reference: string) =>
    referenceRenames.has(reference)
      ? referenceRenames.get(reference)
      : shiftReference(reference, indexAbschnitt);

  updatedAbschnitte.forEach((abschnitt, abschnittIndex) => {
    if (abschnittIndex === indexAbschnitt) {
      return;
    }

    abschnitt.personen?.forEach((person) => {
      if (person.personAuswahl !== "anotherPerson" || !person.personReference) {
        return;
      }
      person.personReference =
        resolveReference(person.personReference) ?? undefined;
    });

    const reuseBeweisePerson = abschnitt.reuseBeweisePerson;
    if (!reuseBeweisePerson) {
      return;
    }

    Object.keys(reuseBeweisePerson).forEach((reference) => {
      const renamed = resolveReference(reference);
      if (renamed === reference) {
        return;
      }
      const value = reuseBeweisePerson[reference];
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
};

export const deleteBeweisAbschnittReference = (
  flowSession: Session,
  indexAbschnitt: number,
) => {
  const abschnitte = (
    flowSession.data as GeldEinklagenFormularKlageErstellenUserData
  ).abschnitte;

  if (
    !arrayIsNonEmpty(abschnitte) ||
    abschnitte.length === 1 ||
    !abschnitte[indexAbschnitt]
  ) {
    return;
  }

  const updatedAbschnitte: Abschnitte = structuredClone(abschnitte);

  // The abschnitt itself is removed afterwards by `deleteArrayItem`; this only fixes up references.
  fixDokumentReferences(updatedAbschnitte, indexAbschnitt);
  fixPersonReferences(updatedAbschnitte, indexAbschnitt);

  // Replace the array wholesale instead of deep-merging, so removed
  // (shrunk) entries actually disappear rather than lingering from the
  // previously stored (longer) array.
  updateSession(flowSession, { abschnitte: updatedAbschnitte }, (_, newData) =>
    Array.isArray(newData) ? newData : undefined,
  );
};
