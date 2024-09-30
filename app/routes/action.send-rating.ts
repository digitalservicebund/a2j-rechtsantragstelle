import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { BannerState, USER_FEEDBACK_ID } from "~/components/userFeedback";
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
  const result = await withZod(
    z.object({ wasHelpful: z.enum(["yes", "no"]) }),
  ).validate(formData);
  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const { getSession, commitSession } = getSessionManager("main");
  const session = await getSession(request.headers.get("Cookie"));
  const userRatingsWasHelpful =
    (session.get(userRatingFieldname) as Record<string, boolean>) ?? {};
  userRatingsWasHelpful[url] = result.data.wasHelpful === "yes";
  session.set(userRatingFieldname, userRatingsWasHelpful);

  updateBannerState(session, BannerState.ShowFeedback, url);
  const headers = { "Set-Cookie": await commitSession(session) };

  sendCustomAnalyticsEvent({
    eventName: "rating given",
    request,
    properties: {
      wasHelpful: userRatingsWasHelpful[url],
      url,
      flowId: flowIdFromPathname(url) ?? "",
    },
  });

  const clientJavaScriptAvailable = searchParams.get("js") === "true";

  return clientJavaScriptAvailable
    ? json({ success: true }, { headers })
    : redirect(`${url}#${USER_FEEDBACK_ID}`, { headers });
};
