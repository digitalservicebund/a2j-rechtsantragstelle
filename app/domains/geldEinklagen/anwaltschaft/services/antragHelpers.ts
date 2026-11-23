import { type ReactNode } from "react";
import { type Session } from "react-router";
import { Result, Unit } from "true-myth";
import {
  type SchmerzengeldNebenantrag,
  type Hauptantrag,
  type Nebenantrag,
  type Schmerzensgeldantrag,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import {
  type DeletionDialogProps,
  type DeletionWarning,
} from "~/domains/geldEinklagen/anwaltschaft/shared/components/DeletionDialog";
import { type SonstigeAntrag } from "~/domains/geldEinklagen/anwaltschaft/sonstigeAntraege/pages";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import {
  deleteArrayItem,
  getArrayForDeletion,
} from "~/services/session.server/arrayDeletion";
import { translations } from "~/services/translations/translations";

export const ANTRAG_DELETION_URL_ENDPOINT =
  "/action/geld-einklagen/anwaltschaft/delete-antrag";

export type Antrag =
  | Hauptantrag
  | Schmerzensgeldantrag
  | Nebenantrag
  | SonstigeAntrag
  | SchmerzengeldNebenantrag;

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
    true,
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
  antragArrayName: string,
  arrayIndexes: number[] = [],
) => {
  const targetArray = getArrayForDeletion(
    userData,
    antragArrayName,
    arrayIndexes,
  );
  return antrag.id
    ? (targetArray?.findIndex(
        (current) =>
          typeof current === "object" &&
          current !== null &&
          "id" in current &&
          current.id === antrag.id,
      ) ?? -1)
    : -1;
};

/**
 * For a given antrag, retrieve the indices of all connected Vorträge, inclusive of Nebenanträge.
 * By default, empty Vorträge are skipped: an antragId is added when a user clicks on "Add Vortrag",
 * but they can exit the page without entering any data. Pass `includeEmpty` to include them,
 * e.g. when deleting an Antrag so that no orphaned Vorträge remain.
 */
export const getAllConnectedVortraegeIndices = (
  antrag: Antrag,
  userData: GeldEinklagenAnwaltschaftUserData,
  includeEmpty?: boolean,
) =>
  (userData.vortraege ?? []).flatMap((vortrag, index) => {
    const isConnected =
      vortrag.antragId === antrag.id ||
      // Include an Antrag's Nebenanträge as well, which are stored as discrete Vorträge array items
      ("nebenantraege" in antrag &&
        antrag.nebenantraege?.some(
          (nebenantrag) => nebenantrag.id === vortrag.antragId,
        ));
    const hasContent = Object.keys(vortrag).length > 1;
    return isConnected && (includeEmpty || hasContent) ? [index] : [];
  });

export const deleteAntrag = (
  flowSession: Session,
  antrag: Antrag,
  antragArrayName: string,
  arrayIndexes: number[] = [],
) => {
  const antragIndex = getAntragIndex(
    antrag,
    flowSession.data,
    antragArrayName,
    arrayIndexes,
  );

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
    arrayIndexes,
  );
  if (antragDeletionResult.isErr) {
    return new Response(antragDeletionResult.error.message, {
      status: 422,
    });
  }
  return new Response("success", { status: 200 });
};

/**
 * Builds the DeletionDialog props for an Antrag. The warning is only shown when
 * deleting the Antrag would also delete connected Vorträge.
 */
export const getAntragDeletionDialogProps = ({
  antrag,
  userData,
  itemLabel,
  warningTexts,
  description,
}: {
  antrag: Antrag;
  userData: GeldEinklagenAnwaltschaftUserData;
  itemLabel: ReactNode;
  warningTexts: Omit<DeletionWarning, "title">;
  description?: string;
}): DeletionDialogProps => ({
  description: description ?? translations.deleteDialog.description.de,
  itemIcon: "draft",
  itemLabel,
  warning:
    getAllConnectedVortraegeIndices(antrag, userData).length > 0
      ? {
          title:
            translations.geldEinklagenAnwaltschaft.antragDeletionWarning.de,
          ...warningTexts,
        }
      : undefined,
});
