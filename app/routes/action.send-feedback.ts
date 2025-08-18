import { parseFormData, validationError } from "@rvf/react-router";
import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { USER_FEEDBACK_ID } from "~/components/content/userFeedback";
import { feedbackSchema } from "~/components/content/userFeedback/FeedbackFormBox";
import { userRatingFieldname } from "~/components/content/userFeedback/RatingBox";
import { flowIdFromPathname } from "~/domains/flowIds";
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
  const result = await parseFormData(formData, feedbackSchema);
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const { getSession, commitSession } = getSessionManager("main");
  const session = await getSession(request.headers.get("Cookie"));
  const userRatingsWasHelpful =
    (session.get(userRatingFieldname) as Record<string, boolean>) ?? {};

  updateBannerState(session, "feedbackGiven", url);
  const headers = { "Set-Cookie": await commitSession(session) };

  if (result.data?.feedback && result.data.feedback !== "") {
    sendCustomAnalyticsEvent({
      eventName: "feedback given",
      request,
      properties: {
        wasHelpful: userRatingsWasHelpful[url],
        feedback: result.data.feedback,
        url,
        flowId: flowIdFromPathname(url) ?? "",
      },
    });
  }

  const clientJavaScriptAvailable = searchParams.get("js") === "true";

  const userFeedbackPath = clientJavaScriptAvailable
    ? url
    : `${url}#${USER_FEEDBACK_ID}`;
  return redirect(userFeedbackPath, { headers });
};
