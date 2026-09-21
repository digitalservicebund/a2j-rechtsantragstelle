import { updateSession } from "~/services/session.server";
import { type Session } from "react-router";
import { type GeldEinklagenFormularKlageErstellenUserData } from "../formular/klage-erstellen/userData";
import { arrayIsNonEmpty } from "~/util/array";

type Abschnitte = Exclude<
  GeldEinklagenFormularKlageErstellenUserData["abschnitte"],
  undefined
>;

// Positions of documents that currently reuse (copy) a given original document reference.
const getDokumentLocationsWithReference = (
  abschnitte: Abschnitte,
  reference: string,
) =>
  abschnitte.flatMap((abschnitt, abschnittIndex) => {
    if (
      !abschnitt.reuseBeweiseDokument ||
      abschnitt.reuseBeweiseDokument[reference] !== "on" ||
      !arrayIsNonEmpty(abschnitt.dokumenten)
    ) {
      return [];
    }

    return abschnitt.dokumenten.flatMap((dokument, dokumentIndex) =>
      dokument.dokumentReference === reference
        ? [{ abschnittIndex, dokumentIndex }]
        : [],
    );
  });

export const deleteBeweisDokumentReference = (
  flowSession: Session,
  arrayIndexes: number[],
) => {
  const abschnitte = (
    flowSession.data as GeldEinklagenFormularKlageErstellenUserData
  ).abschnitte;

  if (!arrayIsNonEmpty(arrayIndexes) || !arrayIsNonEmpty(abschnitte)) {
    return;
  }

  const [indexAbschnitt, indexDokument] = arrayIndexes;
  const currentDokument =
    abschnitte[indexAbschnitt]?.dokumenten?.[indexDokument];

  if (currentDokument === undefined) {
    return;
  }

  const oldReference = `${indexAbschnitt}-${indexDokument}`;
  const updatedAbschnitte: Abschnitte = structuredClone(abschnitte);
  const currentAbschnitt = updatedAbschnitte[indexAbschnitt];

  // The document itself is removed afterwards by `deleteArrayItem`; this only fixes up references.

  // Once that removal happens, later documents in the same abschnitt shift one
  // index down, so any reference pointing at them becomes stale too.
  const referenceRenames = new Map<string, string | null>();
  const siblingCount = currentAbschnitt.dokumenten?.length ?? 0;
  for (let i = indexDokument + 1; i < siblingCount; i++) {
    referenceRenames.set(
      `${indexAbschnitt}-${i}`,
      `${indexAbschnitt}-${i - 1}`,
    );
  }

  // The deleted document was itself a reused copy: switch its own abschnitt's flag off.
  const ownReuseBeweiseDokument = currentAbschnitt.reuseBeweiseDokument;
  if (
    currentDokument.dokumentReference &&
    ownReuseBeweiseDokument &&
    ownReuseBeweiseDokument[currentDokument.dokumentReference] === "on"
  ) {
    ownReuseBeweiseDokument[currentDokument.dokumentReference] = "off";
  }

  // The deleted document was reused elsewhere as the "main" document: promote a replacement.
  const [mainLocation] = getDokumentLocationsWithReference(
    updatedAbschnitte,
    oldReference,
  );

  if (mainLocation) {
    // `deleteArrayItem` runs afterwards and shifts indices after `indexDokument`
    // down within the same abschnitt, so the promoted document's final position
    // (and thus its new reference) must already reflect that shift.
    const finalDokumentIndex =
      mainLocation.abschnittIndex === indexAbschnitt &&
      mainLocation.dokumentIndex > indexDokument
        ? mainLocation.dokumentIndex - 1
        : mainLocation.dokumentIndex;
    const newReference = `${mainLocation.abschnittIndex}-${finalDokumentIndex}`;
    const mainAbschnitt = updatedAbschnitte[mainLocation.abschnittIndex];
    const mainDokument = mainAbschnitt.dokumenten?.[mainLocation.dokumentIndex];

    if (mainDokument) {
      mainDokument.dokumentReference = undefined;
    }
    if (mainAbschnitt.reuseBeweiseDokument) {
      delete mainAbschnitt.reuseBeweiseDokument[oldReference];
    }

    // Other copies still pointing at the old reference get picked up below,
    // via the generic rename pass, since they're no longer the promoted one.
    referenceRenames.set(oldReference, newReference);
  } else {
    // No copy exists to take over: the document is gone for good, drop all traces of it.
    referenceRenames.set(oldReference, null);
  }

  // Apply the renames/removals to every document reference and reuse flag left in the tree.
  updatedAbschnitte.forEach((abschnitt) => {
    abschnitt.dokumenten?.forEach((dokument) => {
      const reference = dokument.dokumentReference;
      if (!reference || !referenceRenames.has(reference)) {
        return;
      }
      dokument.dokumentReference = referenceRenames.get(reference) ?? undefined;
    });

    const reuseBeweiseDokument = abschnitt.reuseBeweiseDokument;
    if (!reuseBeweiseDokument) {
      return;
    }

    Object.keys(reuseBeweiseDokument).forEach((reference) => {
      if (!referenceRenames.has(reference)) {
        return;
      }
      const value = reuseBeweiseDokument[reference];
      const renamed = referenceRenames.get(reference);
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

  // Replace the array wholesale instead of deep-merging, so removed
  // (shrunk) entries actually disappear rather than lingering from the
  // previously stored (longer) array.
  updateSession(flowSession, { abschnitte: updatedAbschnitte }, (_, newData) =>
    Array.isArray(newData) ? newData : undefined,
  );
};
