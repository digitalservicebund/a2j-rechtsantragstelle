import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { BannerState } from "~/components/UserFeedback";
import { wasHelpfulFieldname } from "~/services/feedback/RatingBox";
import { getSessionForContext } from "~/services/session";
import { PostHog } from "posthog-node";
import { config } from "~/services/env/web";
import { bannerStateName } from "~/services/feedback/handleFeedback";

export const loader = () => redirect("/");

const { POSTHOG_API_KEY, POSTHOG_API_HOST, ENVIRONMENT } = config();
const posthogClient = POSTHOG_API_KEY
  ? new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST })
  : undefined;

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const clientJavaScriptAvailable = searchParams.get("js") === "true";
  const url = searchParams.get("url") ?? "";
  const context = searchParams.get("context") ?? "";
  const formData = await request.formData();

  const cookie = request.headers.get("Cookie");
  const { getSession, commitSession } = getSessionForContext("main");
  const session = await getSession(cookie);

  const wasHelpful =
    (session.get(wasHelpfulFieldname) as Record<string, boolean>) ?? {};
  wasHelpful[url] = formData.get(wasHelpfulFieldname) === "yes";
  session.set(wasHelpfulFieldname, wasHelpful);

  const bannerState =
    (session.get(bannerStateName) as Record<string, BannerState>) ?? {};
  bannerState[url] = BannerState.ShowFeedback;
  session.set(bannerStateName, bannerState);

  const headers = { "Set-Cookie": await commitSession(session) };

  posthogClient?.capture({
    distinctId: ENVIRONMENT,
    event: "rating given",
    // eslint-disable-next-line camelcase
    properties: { wasHelpful: wasHelpful[url], $current_url: url, context },
  });

  return clientJavaScriptAvailable
    ? json({ success: true }, { headers })
    : redirect(url, { headers });
};
