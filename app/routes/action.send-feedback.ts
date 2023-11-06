import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  BannerState,
  FeedbackButtons,
  feedbackButtonFieldname,
  feedbackValidator,
  wasHelpfulFieldname,
} from "~/components/UserFeedback";
import { getSessionForContext } from "~/services/session";
import { PostHog } from "posthog-node";
import { config } from "~/services/env/web";
import { bannerStateName } from "./shared/result";

export const loader = () => redirect("/");

const { POSTHOG_API_KEY, POSTHOG_API_HOST, ENVIRONMENT } = config();
const posthogClient = POSTHOG_API_KEY
  ? new PostHog(POSTHOG_API_KEY, { host: POSTHOG_API_HOST })
  : undefined;

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "";
  const context = searchParams.get("context") ?? "";

  const cookie = request.headers.get("Cookie");
  const { getSession, commitSession } = getSessionForContext("main");
  const session = await getSession(cookie);
  const wasHelpfulObj =
    (session.get(wasHelpfulFieldname) as Record<string, boolean>) ?? {};
  const wasHelpful = wasHelpfulObj[url];
  const bannerState =
    (session.get(bannerStateName) as Record<string, BannerState>) ?? {};

  const formData = await request.formData();
  const feedbackButton = formData.get(feedbackButtonFieldname);
  bannerState[url] = BannerState.FeedbackGiven;

  if (feedbackButton === FeedbackButtons.Submit) {
    const validatedFeedback = await feedbackValidator.validate(formData);
    if (validatedFeedback.error) {
      // Returning validationError(validatedFeedback.error, validatedFeedback.submittedData)
      // causes the browser to route to /action/send-feedback, and there seems to way to combine its
      // response body with redirect
      bannerState[url] = BannerState.ShowFeedback;
    } else {
      posthogClient?.capture({
        distinctId: ENVIRONMENT,
        event: "feedback given",
        properties: {
          wasHelpful,
          feedback: validatedFeedback.data?.feedback ?? "",
          // eslint-disable-next-line camelcase
          $current_url: url,
          context,
        },
      });
    }
  }
  session.set(bannerStateName, bannerState);
  const headers = { "Set-Cookie": await commitSession(session) };
  return redirect(url, { headers });
};
