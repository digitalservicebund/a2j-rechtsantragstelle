import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { wasHelpfulFieldname } from "~/components/UserFeedback";
import { getSessionForContext } from "~/services/session";

export const loader = () => redirect("/");
export const wasHelpfulName = "wasHelpful";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const clientJavaScriptAvailable = searchParams.get("js");
  const url = searchParams.get("url") ?? "";

  const cookie = request.headers.get("Cookie");
  const { getSession, commitSession } = getSessionForContext("main");
  const session = await getSession(cookie);
  const wasHelpful =
    (session.get(wasHelpfulName) as Record<string, boolean>) ?? {};

  const formData = await request.formData();
  wasHelpful[url] = formData.get(wasHelpfulFieldname) === "yes";
  session.set(wasHelpfulName, wasHelpful);
  const headers = { "Set-Cookie": await commitSession(session) };

  return clientJavaScriptAvailable
    ? json({ success: true }, { headers })
    : redirect(url, { headers });
};
