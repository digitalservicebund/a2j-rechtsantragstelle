import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { BannerState, USER_FEEDBACK_ID } from "~/components/UserFeedback";
import { feedbackValidator } from "~/components/UserFeedback/FeedbackFormBox";
import { userRatingFieldname } from "~/components/UserFeedback/RatingBox";
import { flowIdFromPathname } from "~/models/flows/flowIds";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getSessionManager } from "~/services/session.server";

export const bannerStateName = "bannerState";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { searchParams } = new URL(request.url);
  const clientJavaScriptAvailable = searchParams.get("js") === "true";
  const url = searchParams.get("url") ?? "";

  if (!url.startsWith("/")) {
    // Abort without redirect on non-relative URLs
    return json({ success: false }, { status: 400 });
  }

  const cookie = request.headers.get("Cookie");
  const { getSession, commitSession } = getSessionManager("main");
  const session = await getSession(cookie);

  const userRating =
    (session.get(userRatingFieldname) as Record<string, boolean>) ?? {};
  const bannerState =
    (session.get(bannerStateName) as Record<string, BannerState>) ?? {};

  const result = await feedbackValidator.validate(formData);
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }
  bannerState[url] = BannerState.FeedbackGiven;
  sendCustomAnalyticsEvent({
    eventName: "feedback given",
    request,
    properties: {
      wasHelpful: userRating[url],
      feedback: result.data?.feedback ?? "",
      url,
      flowId: flowIdFromPathname(url) ?? "",
    },
  });
  session.set(bannerStateName, bannerState);

  const headers = { "Set-Cookie": await commitSession(session) };
  const userFeedbackPath = clientJavaScriptAvailable
    ? url
    : `${url}#${USER_FEEDBACK_ID}`;
  return redirect(userFeedbackPath, { headers });
};
