import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isPartnerAirport,
  partnerCourtAirports,
} from "app/flows/fluggastrechteVorabcheck";
import { getReasonsToDisplay } from "~/flows/common";
import { parsePathname } from "~/flows/flowIds";
import { flows } from "~/flows/flows.server";
import {
  fetchFlowPage,
  fetchMeta,
  fetchTranslations,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { findCourt } from "~/services/gerichtsfinder/amtsgerichtData.server";
import type { Jmtd14VTErwerberGerbeh } from "~/services/gerichtsfinder/types";
import { getSessionData, getSessionManager } from "~/services/session.server";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { interpolateDeep } from "~/util/fillTemplate";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  const { flowId, stepId } = parsePathname(pathname);
  const cookieHeader = request.headers.get("Cookie");

  const sessionManager = getSessionManager(flowId);
  const { userData, debugId } = await getSessionData(flowId, cookieHeader);
  context.debugId = debugId; // For showing in errors

  const currentFlow = flows[flowId];

  const flowController = buildFlowController({
    config: currentFlow.config,
    data: userData,
    guards: currentFlow.guards,
  });

  if (!flowController.isReachable(stepId))
    return redirect(flowController.getInitial());

  const courts = [userData.startAirport, userData.endAirport]
    .filter(isPartnerAirport)
    .map((airport) => findCourt({ zipCode: partnerCourtAirports[airport] }))
    .filter(Boolean) as Jmtd14VTErwerberGerbeh[];

  // TODO: move logic that enriches user data out of the loader
  const zustaendigesAmtsgericht = courts.map((court) => ({
    bezeichnung: court.BEZEICHNUNG,
    strasseMitHausnummer: court.STR_HNR,
    plzUndStadt: `${court.PLZ_ZUSTELLBEZIRK} ${court.ORT}`,
  }));

  if (zustaendigesAmtsgericht.length > 0) {
    const session = await sessionManager.getSession(cookieHeader);
    session.set("zustaendigesAmtsgericht", zustaendigesAmtsgericht[0]);
    await sessionManager.commitSession(session);
  }

  const [
    resultPageContent,
    parentMeta,
    amtsgerichtCommon,
    defaultStrings,
    flowTranslations,
  ] = await Promise.all([
    fetchFlowPage("result-pages", flowId, stepId.replace("ergebnis/", "")),
    fetchMeta({
      filterValue: pathname.substring(0, pathname.lastIndexOf("/")),
    }),
    fetchTranslations("amtsgericht"),
    fetchTranslations("defaultTranslations"),
    fetchTranslations(flowId),
  ]);

  const cmsContent = interpolateDeep(
    resultPageContent,
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userData, flowTranslations)
      : {},
  );

  const reasonElementsWithID =
    cmsContent.reasonings.data?.map((el) => el.attributes) ?? [];

  const { back: backButton } = getButtonNavigationProps({
    backButtonLabel: defaultStrings["backButtonDefaultLabel"],
    nextButtonLabel:
      cmsContent.nextLink?.text ?? defaultStrings["nextButtonDefaultLabel"],
    backDestination: flowController.getPrevious(stepId),
  });

  const { headers } = await updateMainSession({
    cookieHeader,
    flowId,
    stepId,
  });

  return json(
    {
      flowId,
      common: defaultStrings,
      cmsData: cmsContent,
      reasons: reasonElementsWithID.filter((reason) =>
        Boolean(getReasonsToDisplay(userData)[reason.elementId]),
      ),
      meta: { ...cmsContent.meta, breadcrumb: parentMeta?.breadcrumb },
      backButton,
      amtsgerichtCommon,
      courts: cmsContent.pageType === "success" ? courts : [],
    },
    { headers },
  );
};
