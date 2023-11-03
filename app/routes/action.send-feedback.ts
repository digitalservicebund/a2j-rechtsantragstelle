import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { wasHelpfulFieldname } from "~/components/UserFeedback";
import { getSessionForContext } from "~/services/session";
import { PostHog } from "posthog-node";
import { config } from "~/services/env/web";

export const loader = () => redirect("/");
export const wasHelpfulName = "wasHelpful";

const { POSTHOG_API_KEY, POSTHOG_API_HOST, ENVIRONMENT } = config();
const posthogClient = POSTHOG_API_KEY
  ? new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST })
  : undefined;

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

  posthogClient?.capture({
    distinctId: ENVIRONMENT,
    event: "feedback given",
    // eslint-disable-next-line camelcase
    properties: { wasHelpful: wasHelpful[url], $current_url: url },
  });

  return clientJavaScriptAvailable
    ? json({ success: true }, { headers })
    : redirect(url, { headers });
};
