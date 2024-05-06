import type { ActionFunctionArgs } from "@remix-run/node";
import { createCookie, redirect } from "@remix-run/node";
import { consentCookieName } from "~/services/analytics/gdprCookie.server";
import { getSessionManager } from "~/services/session.server";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const contexts = [
    "beratungshilfe/antrag",
    "beratungshilfe/vorabcheck",
    "geld-einklagen/vorabcheck",
    "geld-einklagen/formular",
    "fluggastrechte/vorabcheck",
    "fluggastrechte/formular",
    "main",
  ] as const; // TODO: move to contexts.ts

  for (const context of contexts) {
    const sessionManager = getSessionManager(context);
    const session = await sessionManager.getSession(cookieHeader);
    await sessionManager.destroySession(session);
  }

  // see https://sergiodxa.com/tutorials/delete-a-cookie-using-remix-cookie-helpers
  const opts = { maxAge: 1 };

  return redirect("/", {
    headers: [
      // see https://github.com/remix-run/remix/issues/231#issuecomment-1926294674
      ["Set-Cookie", await createCookie(consentCookieName).serialize("", opts)],
      ["Set-Cookie", await createCookie("__session").serialize("", opts)],
    ],
  });
};
