import { type Session } from "react-router";
import { Result, Unit } from "true-myth";
import {
  type Hauptantrag,
  type Nebenantrag,
  type Schmerzensgeldantrag,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import { type SonstigeAntrag } from "~/domains/geldEinklagen/anwaltschaft/sonstigeAntraege/pages";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { deleteArrayItem } from "~/services/session.server/arrayDeletion";

export const ANTRAG_DELETION_URL_ENDPOINT =
  "/action/geld-einklagen/anwaltschaft/delete-antrag";

export type Antrag =
  Hauptantrag | Schmerzensgeldantrag | Nebenantrag | SonstigeAntrag;

export const hauptantraegeTypes: Array<
  keyof Pick<
    GeldEinklagenAnwaltschaftUserData,
    "hauptantrag" | "schmerzengeldantrag" | "sonstigeAntraege"
  >
> = ["hauptantrag", "schmerzengeldantrag", "sonstigeAntraege"];

const deleteConnectedVortraege = (
  antrag: Antrag,
  flowSession: Session,
): Result<Unit, { message: string }> => {
  const connectedVortragIndexes = getAllConnectedVortraegeIndices(
    antrag,
    flowSession.data,
  );
  // Delete backwards so cloning and removing items cannot invalidate later indexes.
  for (const index of connectedVortragIndexes.reverse()) {
    const vortragDeletionResult = deleteArrayItem(
      "vortraege",
      index,
      flowSession,
      [],
    );
    if (vortragDeletionResult.isErr) {
      return Result.err({
        message: `Could not delete Vortrag: ${vortragDeletionResult.error.message}`,
      });
    }
  }
  return Result.ok(Unit);
};

export const getAntragIndex = (
  antrag: Antrag,
  userData: GeldEinklagenAnwaltschaftUserData,
  antragArrayName: keyof GeldEinklagenAnwaltschaftUserData,
) => {
  const targetArray = userData[antragArrayName];
  return antrag.id && Array.isArray(targetArray)
    ? (targetArray.findIndex(
        (current) => "id" in current && current.id === antrag.id,
      ) ?? -1)
    : -1;
};

/**
 * For a given antrag, retrieve the indices of all connected Vorträge, inclusive of Nebenanträge.
 */
export const getAllConnectedVortraegeIndices = (
  antrag: Antrag,
  userData: GeldEinklagenAnwaltschaftUserData,
) =>
  (userData.vortraege ?? []).flatMap((vortrag, index) =>
    vortrag.antragId === antrag.id ||
    // Include an Antrag's Nebenanträge as well, which are stored as discrete Vorträge array items
    ("nebenantraege" in antrag &&
      antrag.nebenantraege?.some(
        (nebenantrag) => nebenantrag.id === vortrag.antragId,
      ))
      ? [index]
      : [],
  );

export const deleteAntrag = (
  flowSession: Session,
  antrag: Antrag,
  antragArrayName: keyof GeldEinklagenAnwaltschaftUserData,
) => {
  const antragIndex = getAntragIndex(antrag, flowSession.data, antragArrayName);

  if (antragIndex === -1) {
    return new Response("Antrag not found or missing ID.", { status: 422 });
  }

  // Delete any possible connected Vorträge before deleting the Antrag itself
  const deletionResult = deleteConnectedVortraege(antrag, flowSession);
  if (deletionResult.isErr) {
    return new Response(deletionResult.error.message, {
      status: 422,
    });
  }

  // Delete the Antrag itself, in its entirety
  const antragDeletionResult = deleteArrayItem(
    antragArrayName,
    antragIndex,
    flowSession,
    [],
  );
  if (antragDeletionResult.isErr) {
    return new Response(antragDeletionResult.error.message, {
      status: 422,
    });
  }
  return new Response("success", { status: 200 });
};
