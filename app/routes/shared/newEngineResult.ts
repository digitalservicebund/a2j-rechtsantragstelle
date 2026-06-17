import { type LoaderFunctionArgs, redirectDocument, data } from "react-router";
import { flows } from "~/domains/flows.server";
import {
  fetchFlowPage,
  fetchContentPageMeta,
} from "~/services/cms/index.server";
import { getUserDataAndFlowNewEngine } from "~/services/flow/userDataAndFlow/getUserDataAndFlowNewEngine";
import { composePageTitle } from "~/services/meta/composePageTitle";
import { translations } from "~/services/translations/translations";
import {
  applyStringReplacement,
  replacementsFromFlowConfig,
} from "~/util/applyStringReplacement";
import { getButtonNavigationProps } from "~/util/buttonProps";
export { ResultPage as default } from "./components/ResultPage";

export const loader = async ({ request, url }: LoaderFunctionArgs) => {
  const resultUserAndFlow = await getUserDataAndFlowNewEngine(request, url);

  if (resultUserAndFlow.isErr) {
    return redirectDocument(resultUserAndFlow.error.redirectTo);
  }

  const {
    userData,
    flow: { id: flowId, flowSessionEngine },
    page: { stepId },
  } = resultUserAndFlow.value;

  const cmsStepId = stepId.replace("ergebnis/", "");
  const currentFlow = flows[flowId];

  const [resultPageContent, parentContentPageMeta] = await Promise.all([
    fetchFlowPage("result-pages", flowId, cmsStepId),
    fetchContentPageMeta({ filterValue: flowId }),
  ]);

  const cmsContent = applyStringReplacement(
    resultPageContent,
    replacementsFromFlowConfig(currentFlow.stringReplacements, userData),
  );

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel:
      resultPageContent.backButtonLabel ??
      translations.buttonNavigation.backButtonDefaultLabel.de,
    nextButtonLabel:
      cmsContent.nextLink?.text ??
      translations.buttonNavigation.nextButtonDefaultLabel.de,
    backDestination: flowSessionEngine.prevPath
      ? flowId + flowSessionEngine.prevPath
      : undefined,
  });

  const documents = cmsContent.documents?.element ?? [];
  const nextSteps = cmsContent.nextSteps?.element ?? [];

  const pageTitle = applyStringReplacement(
    composePageTitle(cmsContent.pageTitle, parentContentPageMeta),
    replacementsFromFlowConfig(currentFlow.stringReplacements, userData),
  );

  return data({
    cmsContent: { ...cmsContent, nextSteps, documents, pageTitle },
    buttonNavigationProps,
  });
};
