import type { ActionFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { consentCookieFromRequest } from "~/services/analytics/gdprCookie.server";

export const loader = () => redirect("/");

export const action = async ({ request, url }: ActionFunctionArgs) => {
  const { searchParams } = url;
  const clientJavaScriptAvailable = searchParams.get("js");

  const headers = await consentCookieFromRequest({ request });

  if (clientJavaScriptAvailable) {
    return data({ success: true }, { headers });
  }

  return redirect("/datenschutzerklaerung", { headers });
};
