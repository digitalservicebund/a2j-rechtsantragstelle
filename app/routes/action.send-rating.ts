import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { BannerState, USER_FEEDBACK_ID } from "~/components/UserFeedback";
import { userRatingFieldname } from "~/components/UserFeedback/RatingBox";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { bannerStateName } from "~/services/feedback/handleFeedback";
import { getSessionManager } from "~/services/session.server";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const clientJavaScriptAvailable = searchParams.get("js") === "true";
  const url = searchParams.get("url") ?? "";
  if (!url.startsWith("/")) {
    // Abort without redirect on non-relative URLs
    return json({ success: false }, { status: 400 });
  }
  const context = searchParams.get("context") ?? "";
  const formData = await request.formData();

  const cookie = request.headers.get("Cookie");
  const { getSession, commitSession } = getSessionManager("main");
  const session = await getSession(cookie);

  const userRatings =
    (session.get(userRatingFieldname) as Record<string, boolean>) ?? {};
  userRatings[url] = formData.get(userRatingFieldname) === "yes";
  session.set(userRatingFieldname, userRatings);

  const bannerState =
    (session.get(bannerStateName) as Record<string, BannerState>) ?? {};
  bannerState[url] = BannerState.ShowFeedback;
  session.set(bannerStateName, bannerState);

  const headers = { "Set-Cookie": await commitSession(session) };

  sendCustomAnalyticsEvent({
    eventName: "rating given",
    request,
    properties: {
      wasHelpful: userRatings[url],
      context,
    },
  });

  const userFeedbackPath = `${url}#${USER_FEEDBACK_ID}`;
  return clientJavaScriptAvailable
    ? json({ success: true }, { headers })
    : redirect(userFeedbackPath, { headers });
};
