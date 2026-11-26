import get from "lodash/get";
import unset from "lodash/unset";
import { redirect, type ActionFunctionArgs } from "react-router";
import {
  type Hauptantrag,
  type Schmerzensgeldantrag,
} from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import {
  deleteAntrag,
  getAntragIndex,
} from "~/domains/geldEinklagen/anwaltschaft/services/antragHelpers";
import { getConnectedAntraege } from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
import {
  getSingularOfKlageParteiRelationship,
  type KlageParteien,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager } from "~/services/session.server";
import {
  deleteArrayItem,
  getArrayDataFromFormData,
} from "~/services/session.server/arrayDeletion";

export const action = async ({ request }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const formData = await request.formData();
  const resultFormData = getArrayDataFromFormData(formData);
  if (resultFormData.isErr) {
    return new Response(resultFormData.error.message, { status: 422 });
  }
  const {
    flowId,
    arrayName: rawArrayName,
    index,
    arrayIndexes,
    redirectPathname,
  } = resultFormData.value;
  const arrayName = rawArrayName as keyof GeldEinklagenAnwaltschaftUserData;
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const userData = flowSession.data as GeldEinklagenAnwaltschaftUserData;

  // Find and delete dependents
  // If associated Anträge would be invalid, first delete their Tatsachenvorträge, then
  // the Antrag itself
  const targetArray = get(userData, arrayName);
  const targetPartei = Array.isArray(targetArray)
    ? (targetArray[index] as KlageParteien[number])
    : undefined;
  if (!targetPartei?.id) {
    return new Response("Party not found or missing ID.", { status: 422 });
  }
  const relationship = getSingularOfKlageParteiRelationship(arrayName);

  // getConnectedAntraege returns the original objects, including incomplete drafts.
  const hauptantraege = userData.hauptantrag ?? [];
  const getAntragArrayName = (antrag: Hauptantrag | Schmerzensgeldantrag) =>
    hauptantraege.some((hauptantrag) => hauptantrag === antrag)
      ? "hauptantrag"
      : "schmerzengeldantrag";

  const { singlePartyConnectedAntraege, multiPartyConnectedAntraege } =
    getConnectedAntraege(targetPartei.id, relationship, userData);

  // Delete Anträge where the target Partei is the only party involved
  for (const antrag of singlePartyConnectedAntraege) {
    // Delete the Antrag itself, in its entirety, as it's no longer valid with 0 beklagte or klagende
    const antragDeletionResult = deleteAntrag(
      flowSession,
      antrag,
      getAntragArrayName(antrag),
    );
    if (!antragDeletionResult.ok) {
      return antragDeletionResult;
    }
  }

  // Delete target party from the list of involved parties in Anträge with >1 party involved
  for (const antrag of multiPartyConnectedAntraege) {
    const antragArrayName = getAntragArrayName(antrag);
    const antragIndex = getAntragIndex(
      antrag,
      flowSession.data,
      antragArrayName,
    );
    const newUserData = structuredClone<GeldEinklagenAnwaltschaftUserData>(
      flowSession.data,
    );
    const newTargetArray = newUserData[antragArrayName];
    const antragToUpdate = Array.isArray(newTargetArray)
      ? newTargetArray[antragIndex]
      : undefined;
    if (!antragToUpdate) {
      return new Response("Antrag not found or missing ID.", { status: 422 });
    }

    unset(antragToUpdate, `${relationship}[${targetPartei.id}]`);
    flowSession.set(antragArrayName, newUserData[antragArrayName]);
  }

  // Delete klagende Partei
  const partyDeletionResult = deleteArrayItem(
    arrayName,
    index,
    flowSession,
    arrayIndexes,
  );

  if (partyDeletionResult.isErr) {
    return new Response(partyDeletionResult.error.message, { status: 422 });
  }

  const headers = await commitSession(flowSession);

  const clientJavaScriptAvailable = formData.get("_jsEnabled");
  if (clientJavaScriptAvailable === "false") {
    // redirectPathname is the navigable summary page. It differs from the array
    // lookup pathname for nested items, whose pathname is not a real page.
    return redirect(redirectPathname, {
      headers,
    });
  }

  return new Response("success", { status: 200, headers });
};
