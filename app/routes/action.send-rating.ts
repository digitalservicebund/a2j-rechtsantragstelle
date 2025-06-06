import { parseFormData, validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, Session, SessionData } from "react-router";
import { data, redirect } from "react-router";
import { z } from "zod";
import { USER_FEEDBACK_ID } from "~/components/userFeedback";
import { userRatingFieldname } from "~/components/userFeedback/RatingBox";
import { flowIdFromPathname } from "~/domains/flowIds";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getRedirectForNonRelativeUrl } from "~/services/feedback/getRedirectForNonRelativeUrl";
import { updateBannerState } from "~/services/feedback/updateBannerState";
import { getSessionManager } from "~/services/session.server";

export const loader = () => redirect("/");

const actionSendRatingSchema = z.object({ wasHelpful: z.enum(["yes", "no"]) });

const updateRatingWasHepful = (
  session: Session<SessionData, SessionData>,
  wasHelpful: "yes" | "no",
  url: string,
) => {
  const userRatingsWasHelpful =
    (session.get(userRatingFieldname) as Record<string, boolean>) ?? {};
  userRatingsWasHelpful[url] = wasHelpful === "yes";
  session.set(userRatingFieldname, userRatingsWasHelpful);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  const redirectNonRelative = getRedirectForNonRelativeUrl(url);
  if (redirectNonRelative) return redirectNonRelative;

  const formData = await request.formData();
  const {
    error,
    submittedData,
    data: feedbackData,
  } = await parseFormData(formData, actionSendRatingSchema);
  if (error) {
    return validationError(error, submittedData);
  }

  const { getSession, commitSession } = getSessionManager("main");
  const session = await getSession(request.headers.get("Cookie"));
  updateRatingWasHepful(session, feedbackData.wasHelpful, url);
  updateBannerState(session, "showFeedback", url);
  const headers = { "Set-Cookie": await commitSession(session) };

  sendCustomAnalyticsEvent({
    eventName: "rating given",
    request,
    properties: {
      wasHelpful: feedbackData.wasHelpful === "yes",
      url,
      flowId: flowIdFromPathname(url) ?? "",
    },
  });

  searchParams.set("wasHelpful", feedbackData.wasHelpful);

  const clientJavaScriptAvailable = searchParams.get("js") === "true";
  if (clientJavaScriptAvailable) {
    return data({ success: true }, { headers });
  }

  return redirect(
    `${url}?wasHelpful=${feedbackData?.wasHelpful}#${USER_FEEDBACK_ID}`,
    {
      headers,
    },
  );
};
