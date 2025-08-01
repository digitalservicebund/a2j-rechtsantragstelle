import { redirect, type ActionFunctionArgs } from "react-router";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager } from "~/services/session.server";
import {
  getArrayDataFromFormData,
  deleteArrayItem,
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

  const { arrayName, index, flowId, pathname } = resultFormData.value;

  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);

  const resultDeletion = deleteArrayItem(arrayName, index, flowSession);
  if (resultDeletion.isErr) {
    return new Response(resultDeletion.error.message, { status: 422 });
  }

  const headers = { "Set-Cookie": await commitSession(flowSession) };

  const clientJavaScriptAvailable = formData.get("_jsEnabled");
  if (clientJavaScriptAvailable === "false") {
    return redirect(pathname, {
      headers,
    });
  }

  return new Response("success", { status: 200, headers });
};
