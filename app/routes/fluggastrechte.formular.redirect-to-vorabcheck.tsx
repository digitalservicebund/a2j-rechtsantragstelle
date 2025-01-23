import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getSessionManager } from "~/services/session.server";

// Workaround to reset FGR data when user wants to update flight data
// This includes Amtsgericht and Airport data
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");

  const sessionManager = getSessionManager("/fluggastrechte/formular");
  const session = await sessionManager.getSession(cookieHeader);
  await sessionManager.destroySession(session);

  return redirect("/fluggastrechte/vorabcheck/start");
};
