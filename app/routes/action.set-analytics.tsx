import type { ActionFunctionArgs } from "@remix-run/node";
import { data, redirect } from "@remix-run/node";
import { consentCookieFromRequest } from "~/services/analytics/gdprCookie.server";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const clientJavaScriptAvailable = searchParams.get("js");

  const headers = await consentCookieFromRequest({ request });

  if (clientJavaScriptAvailable) {
    return data({ success: true }, { headers: headers });
  }

  return redirect("/cookie-einstellungen", { headers });
};
