import { type Session, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { BannerState, USER_FEEDBACK_ID } from "~/components/UserFeedback";
import {
  feedbackFormName,
  feedbackValidator,
} from "~/components/UserFeedback/FeedbackFormBox";
import { userRatingFieldname } from "~/components/UserFeedback/RatingBox";
import { sendCustomAnalyticsEvent } from "../analytics/customEvent";
import { getSessionManager } from "../session.server";

export const bannerStateName = "bannerState";

export const handleFeedback = async (formData: FormData, request: Request) => {
  const { pathname, searchParams } = new URL(request.url);
  const context = searchParams.get("context") ?? "";

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
  bannerState[pathname] = BannerState.FeedbackGiven;
  sendCustomAnalyticsEvent({
    eventName: "feedback given",
    request,
    properties: {
      wasHelpful: userRating[pathname],
      feedback: result.data?.feedback ?? "",
      context,
    },
  });
  session.set(bannerStateName, bannerState);

  const headers = { "Set-Cookie": await commitSession(session) };
  const userFeedbackPath = `${pathname}#${USER_FEEDBACK_ID}`;
  return redirect(userFeedbackPath, { headers });
};

export const isFeedbackForm = (formData: FormData) => {
  return formData.get("subaction") === feedbackFormName;
};

export const getFeedbackBannerState = (session: Session, url: string) => {
  const getSessionForFeedbackState = session.get(bannerStateName) as Record<
    string,
    BannerState
  >;
  if (getSessionForFeedbackState) {
    return getSessionForFeedbackState[url];
  }
};
