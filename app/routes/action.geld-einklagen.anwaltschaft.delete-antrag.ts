import { redirect, type ActionFunctionArgs } from "react-router";
import {
  type Antrag,
  deleteAntrag,
} from "~/domains/geldEinklagen/anwaltschaft/services/antragHelpers";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager } from "~/services/session.server";
import {
  getArrayDataFromFormData,
  getArrayForDeletion,
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
  const { flowId, arrayName, index, redirectPathname, arrayIndexes } =
    resultFormData.value;
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);

  const targetArray = getArrayForDeletion(
    flowSession.data,
    arrayName,
    arrayIndexes,
  );
  const targetAntrag = targetArray?.[index] as Antrag | undefined;
  if (!targetAntrag?.id) {
    return new Response("Antrag not found or missing ID.", { status: 422 });
  }

  const antragDeletionResult = deleteAntrag(
    flowSession,
    targetAntrag,
    arrayName,
    arrayIndexes,
  );
  if (!antragDeletionResult.ok) {
    return antragDeletionResult;
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
