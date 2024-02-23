import type { ActionFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSessionForContext } from "~/services/session.server";
import {
  fetchCollectionEntry,
  fetchMeta,
  fetchSingleEntry,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { getReasonsToDisplay } from "~/models/flows/common";
import { parsePathname } from "~/models/flows/contexts";
import { flows } from "~/models/flows/flows.server";
import { BannerState } from "~/components/UserFeedback";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { lastStepKey } from "~/services/flow/constants";
import {
  getFeedbackBannerState,
  handleFeedback,
  isFeedbackForm,
} from "~/services/feedback/handleFeedback";
import {
  isPartnerAirport,
  partnerCourtAirports,
} from "~/models/flows/fluggastrechte";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled(request);

  // get data from request
  const { pathname } = new URL(request.url);
  const { flowId, stepId } = parsePathname(pathname);
  const cookieId = request.headers.get("Cookie");
  const { data, id } = await getSessionForContext(flowId).getSession(cookieId);
  context.sessionId = getSessionForContext(flowId).getSessionId(id); // For showing in errors

  const { config, guards } = flows[flowId];
  const flowController = buildFlowController({ config, data, guards });

  if (!flowController.isReachable(stepId))
    return redirect(flowController.getInitial());

  // Slug change to keep Strapi slugs without ergebnis/
  const slug = pathname.replace(/ergebnis\//, "");
  const [common, cmsData, parentMeta, amtsgerichtCommon] = await Promise.all([
    fetchSingleEntry("vorab-check-common"),
    fetchCollectionEntry("result-pages", slug),
    fetchMeta({
      filterValue: pathname.substring(0, pathname.lastIndexOf("/")),
    }),
    fetchSingleEntry("amtsgericht-common"),
  ]);

  const reasonElementsWithID =
    cmsData.reasonings.data?.map((el) => el.attributes) ?? [];

  const hideNextButton =
    flowController.isFinal(stepId) && cmsData.nextLink?.url === undefined;
  const nextButton = hideNextButton
    ? undefined
    : {
        destination: cmsData.nextLink?.url ?? undefined,
        label: cmsData.nextLink?.text ?? common.nextButtonDefaultLabel,
      };

  const { getSession, commitSession } = getSessionForContext("main");
  const userDataFromRedis = await getSession(cookieId);
  userDataFromRedis.set(lastStepKey, { [flowId]: stepId });

  return json(
    {
      flowId,
      common,
      cmsData: cmsData,
      content: cmsData.freeZone,
      meta: { ...cmsData.meta, breadcrumbTitle: parentMeta?.title ?? "" },
      reasons: reasonElementsWithID.filter((reason) =>
        Boolean(getReasonsToDisplay(data)[reason.elementId]),
      ),
      progress: flowController.getProgress(stepId),
      nextButton,
      backButton: {
        destination: flowController.getPrevious(stepId),
        label: common.backButtonDefaultLabel,
      },
      bannerState:
        getFeedbackBannerState(userDataFromRedis, pathname) ??
        BannerState.ShowRating,
      amtsgerichtCommon,
      courts:
        cmsData.pageType === "success" &&
        [data.startAirport, data.endAirport]
          .filter(isPartnerAirport)
          .map((airport) =>
            findCourt({ zipCode: partnerCourtAirports[airport] }),
          ),
    },
    { headers: { "Set-Cookie": await commitSession(userDataFromRedis) } },
  );
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  if (isFeedbackForm(formData)) return handleFeedback(formData, request);
};
