import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { consentCookieFromRequest } from "~/services/analytics/gdprCookie.server";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookie = await consentCookieFromRequest({ request });
  const headers = { "Set-Cookie": cookie };
  const jsDisabled = request.headers.get("Sec-Fetch-Mode") === "navigate";
  if (jsDisabled) return redirect("/cookie-einstellungen", { headers });
  return json({ success: true }, { headers });
};
