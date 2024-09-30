import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { BannerState, USER_FEEDBACK_ID } from "~/components/userFeedback";
import { feedbackValidator } from "~/components/userFeedback/FeedbackFormBox";
import { userRatingFieldname } from "~/components/userFeedback/RatingBox";
import { flowIdFromPathname } from "~/flows/flowIds";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getRedirectForNonRelativeUrl } from "~/services/feedback/getRedirectForNonRelativeUrl";
import { getSessionManager } from "~/services/session.server";

export const bannerStateName = "bannerState";

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

  const clientJavaScriptAvailable = searchParams.get("js") === "true";

  const userFeedbackPath = clientJavaScriptAvailable
    ? url
    : `${url}#${USER_FEEDBACK_ID}`;
  return redirect(userFeedbackPath, { headers });
};
