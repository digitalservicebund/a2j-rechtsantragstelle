import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { BannerState, USER_FEEDBACK_ID } from "~/components/userFeedback";
import { userRatingFieldname } from "~/components/userFeedback/RatingBox";
import { flowIdFromPathname } from "~/flows/flowIds";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { bannerStateName } from "~/services/feedback/getFeedbackBannerState";
import { getRedirectForNonRelativeUrl } from "~/services/feedback/getRedirectForNonRelativeUrl";
import { getSessionManager } from "~/services/session.server";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  const redirectNonRelative = getRedirectForNonRelativeUrl(url);
  if (redirectNonRelative) return redirectNonRelative;

  // TODO - Improve this block to share same code with action.send-feedback.ts
  const formData = await request.formData();
  // needs a validation here

  const { getSession, commitSession } = getSessionManager("main");
  const session = await getSession(request.headers.get("Cookie"));

  const userRatings =
    (session.get(userRatingFieldname) as Record<string, boolean>) ?? {};
  userRatings[url] = formData.get(userRatingFieldname) === "yes";
  session.set(userRatingFieldname, userRatings);

  const bannerStates =
    (session.get(bannerStateName) as Record<string, BannerState>) ?? {};
  bannerStates[url] = BannerState.ShowFeedback;
  session.set(bannerStateName, bannerStates);

  sendCustomAnalyticsEvent({
    eventName: "rating given",
    request,
    properties: {
      wasHelpful: userRatings[url],
      url,
      flowId: flowIdFromPathname(url) ?? "",
    },
  });

  const headers = { "Set-Cookie": await commitSession(session) };

  const clientJavaScriptAvailable = searchParams.get("js") === "true";

  return clientJavaScriptAvailable
    ? json({ success: true }, { headers })
    : redirect(`${url}#${USER_FEEDBACK_ID}`, { headers });
};
