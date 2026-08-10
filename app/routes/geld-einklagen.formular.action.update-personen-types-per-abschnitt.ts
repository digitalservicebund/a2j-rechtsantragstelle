import { type ActionFunctionArgs } from "react-router";
import { updatePersonenTypesPerAbschnitt } from "~/domains/geldEinklagen/services/updatePersonenTypesPerAbschnitt";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager } from "~/services/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const { getSession, commitSession } = getSessionManager(
    "/geld-einklagen/formular",
  );
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);

  await updatePersonenTypesPerAbschnitt(request, flowSession.data, flowSession);

  const headers = await commitSession(flowSession);

  return new Response("success", { status: 200, headers });
};
