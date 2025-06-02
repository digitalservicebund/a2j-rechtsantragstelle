import type { LoaderFunctionArgs } from "react-router";
import { data, redirect } from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import {
  fetchFlowPage,
  fetchMeta,
  fetchTranslations,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { stepMeta } from "~/services/meta/formStepMeta";
import { skipFlowParamAllowedAndEnabled } from "~/services/params";
import { getSessionData } from "~/services/session.server";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
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

  const [resultPageContent, parentMeta, defaultStrings] = await Promise.all([
    fetchFlowPage("result-pages", flowId, cmsStepId),
    fetchMeta({ filterValue: flowId }),
    fetchTranslations("defaultTranslations"),
  ]);

  const cmsContent = applyStringReplacement(
    resultPageContent,
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userData)
      : {},
  );

  const { back: backButton } = getButtonNavigationProps({
    backButtonLabel:
      resultPageContent.backButtonLabel ??
      defaultStrings.backButtonDefaultLabel,
    nextButtonLabel:
      cmsContent.nextLink?.text ?? defaultStrings.nextButtonDefaultLabel,
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
      common: defaultStrings,
      cmsData,
      meta: meta,
      backButton,
    },
    { headers },
  );
};
