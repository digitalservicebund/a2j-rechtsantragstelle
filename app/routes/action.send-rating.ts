import type { ActionFunctionArgs, Session, SessionData } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { BannerState, USER_FEEDBACK_ID } from "~/components/userFeedback";
import { userRatingFieldname } from "~/components/userFeedback/RatingBox";
import { flowIdFromPathname } from "~/domains/flowIds";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getRedirectForNonRelativeUrl } from "~/services/feedback/getRedirectForNonRelativeUrl";
import { updateBannerState } from "~/services/feedback/updateBannerState";
import { getSessionManager } from "~/services/session.server";

export const loader = () => redirect("/");

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
  const { error, submittedData, data } = await withZod(
    z.object({ wasHelpful: z.enum(["yes", "no"]) }),
  ).validate(formData);
  if (error) {
    return validationError(error, submittedData);
  }

  const { getSession, commitSession } = getSessionManager("main");
  const session = await getSession(request.headers.get("Cookie"));
  updateRatingWasHepful(session, data.wasHelpful, url);
  updateBannerState(session, BannerState.ShowFeedback, url);
  const headers = { "Set-Cookie": await commitSession(session) };

  sendCustomAnalyticsEvent({
    eventName: "rating given",
    request,
    properties: {
      wasHelpful: data.wasHelpful === "yes",
      url,
      flowId: flowIdFromPathname(url) ?? "",
    },
  });

  const updatedUrl = new URL(url, request.url);
  updatedUrl.searchParams.set("wasHelpful", data.wasHelpful);

  const clientJavaScriptAvailable = searchParams.get("js") === "true";
  if (clientJavaScriptAvailable) {
    return json({ success: true }, { headers });
  }

  return redirect(`${updatedUrl.toString()}#${USER_FEEDBACK_ID}`, { headers });
};
