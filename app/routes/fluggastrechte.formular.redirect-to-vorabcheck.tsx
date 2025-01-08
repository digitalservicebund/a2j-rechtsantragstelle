import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getSessionManager } from "~/services/session.server";
//workaround to redirect to the vorabcheck result
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");

  const sessionManager = getSessionManager("/fluggastrechte/formular");
  const session = await sessionManager.getSession(cookieHeader);
  await sessionManager.destroySession(session);

  return redirect("/fluggastrechte/vorabcheck/start");
};
