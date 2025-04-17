import type { ActionFunctionArgs } from "react-router";
import { createCookie, redirect } from "react-router";
import { consentCookieName } from "~/services/analytics/gdprCookie.server";
import {
  allSessionContexts,
  getSessionManager,
} from "~/services/session.server";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  for (const context of allSessionContexts) {
    const sessionManager = getSessionManager(context);
    const session = await sessionManager.getSession(cookieHeader);
    await sessionManager.destroySession(session);
  }

  // see https://sergiodxa.com/tutorials/delete-a-cookie-using-remix-cookie-helpers
  const opts = { maxAge: 1 };

  return redirect("/persoenliche-daten-geloescht", {
    headers: [
      // see https://github.com/remix-run/remix/issues/231#issuecomment-1926294674
      ["Set-Cookie", await createCookie(consentCookieName).serialize("", opts)],
      ["Set-Cookie", await createCookie("__session").serialize("", opts)],
    ],
  });
};
