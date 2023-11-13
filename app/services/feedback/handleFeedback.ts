import { getSessionForContext } from "../session";
import { BannerState } from "~/components/UserFeedback";
import { feedbackFormName, feedbackValidator } from "./FeedbackFormBox";
import { userRatingFieldname } from "./RatingBox";
import { validationError } from "remix-validated-form";
import { config } from "../env/web";
import { PostHog } from "posthog-node";
import { type Session, redirect } from "@remix-run/node";

const { POSTHOG_API_KEY, POSTHOG_API_HOST, ENVIRONMENT } = config();
const posthogClient = POSTHOG_API_KEY
  ? new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST })
  : undefined;

export const bannerStateName = "bannerState";

export const handleFeedback = async (formData: FormData, request: Request) => {
  const { pathname, searchParams } = new URL(request.url);
  const context = searchParams.get("context") ?? "";

  const cookie = request.headers.get("Cookie");
  const { getSession, commitSession } = getSessionForContext("main");
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
  posthogClient?.capture({
    distinctId: ENVIRONMENT,
    event: "feedback given",
    properties: {
      wasHelpful: userRating[pathname],
      feedback: result.data?.feedback ?? "",
      // eslint-disable-next-line camelcase
      $current_url: pathname,
      context,
    },
  });
  session.set(bannerStateName, bannerState);
  const headers = { "Set-Cookie": await commitSession(session) };
  return redirect(pathname, { headers });
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
