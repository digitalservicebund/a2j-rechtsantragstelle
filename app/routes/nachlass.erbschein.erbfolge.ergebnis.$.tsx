import { data, type LoaderFunctionArgs, redirect } from "react-router";
import { throw404OnProduction } from "~/services/errorPages/throw404";
import { parsePathname } from "~/domains/flowIds";
import { nachlassErbfolgeStaticFlow } from "~/domains/nachlass/erbschein/erbfolge/flowConfig";
import type { Replacements } from "~/util/applyStringReplacement";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { fetchFlowPage } from "~/services/cms/index.server";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { getSessionData } from "~/services/session.server";
import { getButtonNavigationProps } from "~/util/buttonProps";
export { ResultPage as default } from "~/routes/shared/components/ResultPage";

const staticFlow = nachlassErbfolgeStaticFlow;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  throw404OnProduction();
  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const fullUserData = addPageDataToUserData(
    await getSessionData(flowId, cookieHeader),
    { arrayIndexes },
  );

  const flowSession = createFlowSession(
    staticFlow,
    fullUserData as Parameters<typeof createFlowSession>[1],
    stepId,
  );

  if (!flowSession.isReachable(stepId)) {
    return redirect(flowId + flowSession.initialPath);
  }

  const cmsStepId = stepId.replace("/ergebnis", "");
  const replacements = { ...flowSession.prunedUserData } as Replacements;

  const rawPage = applyStringReplacement(
    await fetchFlowPage("result-pages", flowId, cmsStepId),
    replacements,
  );

  const prevStepId = flowSession.prevPath;
  const backDestination = prevStepId
    ? flowId + resolveArrayCharacter(prevStepId, arrayIndexes, false)
    : undefined;

  return data({
    cmsContent: {
      ...rawPage,
      documents: rawPage.documents?.element ?? [],
      nextSteps: rawPage.nextSteps?.element ?? [],
    },
    buttonNavigationProps: getButtonNavigationProps({
      backButtonLabel: rawPage.backButtonLabel ?? "Zurück",
      nextButtonLabel: rawPage.nextLink?.text ?? "Weiter",
      backDestination,
    }),
  });
};
