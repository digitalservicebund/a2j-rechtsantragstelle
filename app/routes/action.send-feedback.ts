import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { BannerState, USER_FEEDBACK_ID } from "~/components/userFeedback";
import { feedbackValidator } from "~/components/userFeedback/FeedbackFormBox";
import { userRatingFieldname } from "~/components/userFeedback/RatingBox";
import { flowIdFromPathname } from "~/flows/flowIds";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getRedirectForNonRelativeUrl } from "~/services/feedback/getRedirectForNonRelativeUrl";
import { updateBannerState } from "~/services/feedback/updateBannerState";
import { getSessionManager } from "~/services/session.server";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  const redirectNonRelative = getRedirectForNonRelativeUrl(url);
  if (redirectNonRelative) return redirectNonRelative;

  const formData = await request.formData();
  const result = await feedbackValidator.validate(formData);
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  // second function
  const { getSession, commitSession } = getSessionManager("main");
  const session = await getSession(request.headers.get("Cookie"));
  const userRatingsWasHelpful =
    (session.get(userRatingFieldname) as Record<string, boolean>) ?? {};

  updateBannerState(session, BannerState.FeedbackGiven, url);
  const headers = { "Set-Cookie": await commitSession(session) };

  sendCustomAnalyticsEvent({
    eventName: "feedback given",
    request,
    properties: {
      wasHelpful: userRatingsWasHelpful[url],
      feedback: result.data?.feedback ?? "",
      url,
      flowId: flowIdFromPathname(url) ?? "",
    },
  });

  const clientJavaScriptAvailable = searchParams.get("js") === "true";

  const userFeedbackPath = clientJavaScriptAvailable
    ? url
    : `${url}#${USER_FEEDBACK_ID}`;
  return redirect(userFeedbackPath, { headers });
};
