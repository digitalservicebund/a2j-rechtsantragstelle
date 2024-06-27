import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import PageContent from "~/components/PageContent";
import { BannerState } from "~/components/UserFeedback";
import { UserFeedbackContext } from "~/components/UserFeedback/UserFeedbackContext";
import { strapiPageFromRequest } from "~/services/cms/index.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import {
  getFeedbackBannerState,
  handleFeedback,
  isFeedbackForm,
} from "~/services/feedback/handleFeedback";
import { mainSessionFromCookieHeader } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled(request);
  try {
    const { pathname } = new URL(request.url);
    const cookieHeader = request.headers.get("Cookie");
    const mainSession = await mainSessionFromCookieHeader(cookieHeader);
    const { content, meta } = await strapiPageFromRequest({ request });
    return json({
      content,
      meta,
      bannerState:
        getFeedbackBannerState(mainSession, pathname) ?? BannerState.ShowRating,
    });
  } catch (error) {
    if ((error as Error).name === "StrapiPageNotFound") {
      throw new Response(null, { status: 404 });
    }
    throw error;
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (isFeedbackForm(formData)) return handleFeedback(formData, request);
};

export default function Index() {
  const { content, bannerState } = useLoaderData<typeof loader>();

  const userFeedbackContextValue = useMemo(
    () => ({ bannerState: bannerState }),
    [bannerState],
  );

  return (
    <UserFeedbackContext.Provider value={userFeedbackContextValue}>
      <PageContent content={content} />
    </UserFeedbackContext.Provider>
  );
}
