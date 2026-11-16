import { randomUUID } from "node:crypto";
import set from "lodash/set";
import { redirectDocument, type ActionFunctionArgs } from "react-router";
import { getAbsaetzeBaseUrl } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/absaetzeHelpers";
import { getOrderedAntraege } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/antragOrdering";
import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager } from "~/services/session.server";

/**
 * Opens the Absätze of an Antrag by finding or creating its linked Vortrag.
 * Anträge get their ID when saved (setAntragId, setNebenantragIdentity); the
 * fallback below only covers Anträge saved before that existed.
 *
 * Vorträge whose Antrag no longer exists are deliberately left in place, because
 * users can reach any page without passing through here. Every reader resolves
 * Vorträge through getOrderedAntraege, which skips them. Removing them is up to
 * the Antrag deletion actions.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const formData = await request.formData();
  const antragKey = formData.get("antragKey");
  if (typeof antragKey !== "string" || antragKey === "") {
    return new Response("Missing antragKey", { status: 422 });
  }

  const { getSession, commitSession } = getSessionManager(
    "/geld-einklagen/anwaltschaft",
  );
  const flowSession = await getSession(request.headers.get("Cookie"));
  const userData = structuredClone(
    flowSession.data,
  ) as GeldEinklagenAnwaltschaftUserData;

  const antraege = getOrderedAntraege(userData);
  const antrag = antraege.find(({ key }) => key === antragKey);
  if (!antrag) {
    return new Response("Unknown Antrag", { status: 422 });
  }

  let antragId = antrag.antragId;
  if (!antragId && antrag.dataPath) {
    antragId = randomUUID();
    set(userData, `${antrag.dataPath}.id`, antragId);
    const arrayName = antrag.dataPath.split(".")[0] as keyof typeof userData;
    flowSession.set(arrayName, userData[arrayName]);
  }
  if (!antragId) {
    return new Response("Antrag without ID", { status: 422 });
  }

  const vortraege = [...(userData.vortraege ?? [])];
  let vortragIndex = vortraege.findIndex(
    (vortrag) => vortrag.antragId === antragId,
  );
  if (vortragIndex === -1) {
    vortraege.push({ antragId });
    vortragIndex = vortraege.length - 1;
  }
  flowSession.set("vortraege", vortraege);

  const headers = await commitSession(flowSession);
  return redirectDocument(getAbsaetzeBaseUrl(vortragIndex), { headers });
};
