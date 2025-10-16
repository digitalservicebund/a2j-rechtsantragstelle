import { type LoaderFunctionArgs, redirectDocument, data } from "react-router";
import { flows } from "~/domains/flows.server";
import { fetchFlowPage } from "~/services/cms/index.server";
import { getUserDataAndFlow } from "~/services/flow/userDataAndFlow/getUserDataAndFlow";
import { composePageTitle } from "~/services/meta/composePageTitle";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { translations } from "~/services/translations/translations";
import {
  applyStringReplacement,
  replacementsFromFlowConfig,
} from "~/util/applyStringReplacement";
import { getButtonNavigationProps } from "~/util/buttonProps";
export { ResultPage as default } from "./components/ResultPage";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const resultUserAndFlow = await getUserDataAndFlow(request);

  if (resultUserAndFlow.isErr) {
    return redirectDocument(resultUserAndFlow.error.redirectTo);
  }

  const {
    userData,
    flow: { id: flowId, controller: flowController },
    page: { stepId },
  } = resultUserAndFlow.value;

  const cmsStepId = stepId.replace("ergebnis/", "");
  const cookieHeader = request.headers.get("Cookie");
  const currentFlow = flows[flowId];

  const resultPageContent = await fetchFlowPage(
    "result-pages",
    flowId,
    cmsStepId,
  );

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
    backDestination: flowController.getPrevious(stepId),
  });

  const { headers } = await updateMainSession({
    cookieHeader,
    flowId,
    stepId,
  });

  const documents = cmsContent.documents?.element ?? [];
  const nextSteps = cmsContent.nextSteps?.element ?? [];

  const pageTitle = applyStringReplacement(
    await composePageTitle(cmsContent.pageTitle, flowId),
    replacementsFromFlowConfig(currentFlow.stringReplacements, userData),
  );

  return data(
    {
      cmsContent: { ...cmsContent, nextSteps, documents, pageTitle },
      buttonNavigationProps,
    },
    { headers },
  );
};
