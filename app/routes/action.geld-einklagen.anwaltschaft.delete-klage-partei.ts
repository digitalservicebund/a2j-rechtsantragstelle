import get from "lodash/get";
import partition from "lodash/partition";
import { redirect, type ActionFunctionArgs } from "react-router";
import {
  deleteConnectedVortraege,
  getConnectedAntraege,
  antragHasOnlyOneParty,
  getAntragDetails,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartyHelpers";
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
  const { flowId, arrayName, index, arrayIndexes, redirectPathname } =
    resultFormData.value;
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const userData = flowSession.data as GeldEinklagenAnwaltschaftUserData;

  // Find and delete dependents
  // If associated Anträge would be invalid, first delete their Tatsachenvorträge, then
  // the Antrag itself
  const targetPartei = get(userData, arrayName)[index] as KlageParteien[number];
  if (!targetPartei?.id) {
    return new Response("Party not found or missing ID.", { status: 422 });
  }
  const relationship = getSingularOfKlageParteiRelationship(arrayName);

  const [singlePartyConnectedAntraege, multiPartyConnectedAntraege] = partition(
    getConnectedAntraege(targetPartei.id, relationship, flowSession.data),
    antragHasOnlyOneParty(relationship),
  );

  // Delete Anträge where the target Partei is the only party involved
  for (const antrag of singlePartyConnectedAntraege) {
    const { antragArrayName, antragIndex } = getAntragDetails(
      antrag,
      flowSession.data,
    );
    if (antragIndex < 0) {
      return new Response("Antrag not found or missing ID.", { status: 422 });
    }

    // Delete any possible connected Vorträge before deleting the Antrag itself
    const deletionResult = deleteConnectedVortraege(antrag, flowSession);
    if (deletionResult.isErr) {
      return new Response(deletionResult.error.message, {
        status: 422,
      });
    }

    // Delete the Antrag itself, in its entirety, as it's no longer valid with 0 beklagte or klagende
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
  }

  // Delete target party from the list of involved parties in Anträge with >1 party involved
  for (const antrag of multiPartyConnectedAntraege) {
    const { antragArrayName, antragIndex } = getAntragDetails(
      antrag,
      flowSession.data,
    );
    const newUserData = structuredClone(
      flowSession.data as GeldEinklagenAnwaltschaftUserData,
    );
    const antragToUpdate = newUserData[antragArrayName]?.[antragIndex];
    if (!antragToUpdate) {
      return new Response("Antrag not found or missing ID.", { status: 422 });
    }

    delete antragToUpdate[relationship][targetPartei.id];
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
