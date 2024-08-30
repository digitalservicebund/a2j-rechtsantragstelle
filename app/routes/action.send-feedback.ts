import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { BannerState, USER_FEEDBACK_ID } from "~/components/userFeedback";
import { feedbackValidator } from "~/components/userFeedback/FeedbackFormBox";
import { userRatingFieldname } from "~/components/userFeedback/RatingBox";
import { flowIdFromPathname } from "~/flows/flowIds";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getSessionManager } from "~/services/session.server";

export const bannerStateName = "bannerState";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  if (!url.startsWith("/")) {
    // Abort without redirect on non-relative URLs
    return json({ success: false }, { status: 400 });
  }
  const clientJavaScriptAvailable = searchParams.get("js") === "true";

  const formData = await request.formData();
  const result = await feedbackValidator.validate(formData);
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const { getSession, commitSession } = getSessionManager("main");
  const session = await getSession(request.headers.get("Cookie"));

  const userRatings =
    (session.get(userRatingFieldname) as Record<string, boolean>) ?? {};

  const bannerStates =
    (session.get(bannerStateName) as Record<string, BannerState>) ?? {};
  bannerStates[url] = BannerState.FeedbackGiven;
  session.set(bannerStateName, bannerStates);

  sendCustomAnalyticsEvent({
    eventName: "feedback given",
    request,
    properties: {
      wasHelpful: userRatings[url],
      feedback: result.data?.feedback ?? "",
      url,
      flowId: flowIdFromPathname(url) ?? "",
    },
  });

  const headers = { "Set-Cookie": await commitSession(session) };

  const userFeedbackPath = clientJavaScriptAvailable
    ? url
    : `${url}#${USER_FEEDBACK_ID}`;
  return redirect(userFeedbackPath, { headers });
};
