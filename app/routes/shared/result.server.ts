import type { LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { fetchFlowPage, fetchMeta } from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { stepMeta } from "~/services/meta/formStepMeta";
import { skipFlowParamAllowedAndEnabled } from "~/services/params";
import { getSessionData } from "~/services/session.server";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { translations } from "~/services/translations/translations";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { getButtonNavigationProps } from "~/util/buttonProps";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { pathname, searchParams } = new URL(request.url);
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

  if (
    !flowController.isReachable(stepId) &&
    !skipFlowParamAllowedAndEnabled(searchParams)
  )
    return redirect(flowController.getInitial());

  const [resultPageContent, parentMeta] = await Promise.all([
    fetchFlowPage("result-pages", flowId, cmsStepId),
    fetchMeta({ filterValue: flowId }),
  ]);

  const cmsContent = applyStringReplacement(
    resultPageContent,
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userData)
      : {},
  );

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel:
      resultPageContent.backButtonLabel ??
      translations.buttonNavigation.backButtonDefaultLabel.de,
    nextButtonLabel:
      cmsContent.nextLink?.text ??
      translations.buttonNavigation.nextButtonDefaultLabel.de,
    backDestination: flowController.getPrevious(stepId),
  });

  const { headers } = await updateMainSession({
    cookieHeader,
    flowId,
    stepId,
  });

  const documents = cmsContent.documents?.element ?? [];
  const nextSteps = cmsContent.nextSteps?.element ?? [];

  const cmsData = { ...cmsContent, nextSteps, documents };

  const meta = applyStringReplacement(
    stepMeta(cmsContent.pageMeta, parentMeta),
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userData)
      : undefined,
  );
  return data(
    {
      flowId,
      cmsData,
      meta: meta,
      buttonNavigationProps,
    },
    { headers },
  );
};
