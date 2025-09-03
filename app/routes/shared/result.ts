import { type LoaderFunctionArgs, redirectDocument, data } from "react-router";
import { flows } from "~/domains/flows.server";
import { fetchFlowPage, fetchMeta } from "~/services/cms/index.server";
import { getUserDataAndFlow } from "~/services/flow/userDataAndFlow/getUserDataAndFlow";
import { stepMeta } from "~/services/meta/formStepMeta";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { translations } from "~/services/translations/translations";
import { applyStringReplacement } from "~/util/applyStringReplacement";
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

  const [resultPageContent, parentMeta] = await Promise.all([
    fetchFlowPage("result-pages", flowId, cmsStepId),
    fetchMeta({ filterValue: flowId }),
  ]);

  const cmsContent = applyStringReplacement(
    resultPageContent,
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userData)
      : undefined,
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
      cmsData,
      meta: meta,
      buttonNavigationProps,
    },
    { headers },
  );
};
