import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { BannerState } from "~/components/UserFeedback";
import { userRatingFieldname } from "~/components/UserFeedback/RatingBox";
import { getSessionForContext } from "~/services/session.server";
import { bannerStateName } from "~/services/feedback/handleFeedback";
import { sendCustomEvent } from "~/services/analytics/customEvent";

export const loader = () => redirect("/");

export const action = async ({ request }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const clientJavaScriptAvailable = searchParams.get("js") === "true";
  const url = searchParams.get("url") ?? "";
  const context = searchParams.get("context") ?? "";
  const formData = await request.formData();

  const cookie = request.headers.get("Cookie");
  const { getSession, commitSession } = getSessionForContext("main");
  const session = await getSession(cookie);

  const userRatings =
    (session.get(userRatingFieldname) as Record<string, boolean>) ?? {};
  userRatings[url] = formData.get(userRatingFieldname) === "yes";
  session.set(userRatingFieldname, userRatings);

  const bannerState =
    (session.get(bannerStateName) as Record<string, BannerState>) ?? {};
  bannerState[url] = BannerState.ShowFeedback;
  session.set(bannerStateName, bannerState);

  const headers = { "Set-Cookie": await commitSession(session) };

  sendCustomEvent({
    eventName: "rating given",
    request,
    properties: { wasHelpful: userRatings[url], context },
  });

  return clientJavaScriptAvailable
    ? json({ success: true }, { headers })
    : redirect(url, { headers });
};
