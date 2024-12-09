import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import {
  fetchFlowPage,
  fetchMeta,
  fetchTranslations,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { getSessionData } from "~/services/session.server";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { interpolateSerializableObject } from "~/util/fillTemplate";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  const { flowId, stepId } = parsePathname(pathname);
  const cmsStepId = stepId.replace("ergebnis/", "");
  const cookieHeader = request.headers.get("Cookie");

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

  const [resultPageContent, parentMeta, defaultStrings] = await Promise.all([
    fetchFlowPage("result-pages", flowId, cmsStepId),
    fetchMeta({ filterValue: flowId }),
    fetchTranslations("defaultTranslations"),
  ]);

  const cmsContent = interpolateSerializableObject(
    resultPageContent,
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userData)
      : {},
  );

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

  const documents = cmsContent.documents.data?.attributes.element ?? [];
  const nextSteps = cmsContent.nextSteps.data?.attributes.element ?? [];

  const cmsData = { ...cmsContent, nextSteps, documents };

  return json(
    {
      flowId,
      common: defaultStrings,
      cmsData,
      meta: { ...cmsContent.meta, breadcrumb: parentMeta?.breadcrumb },
      backButton,
    },
    { headers },
  );
};
