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
import { type FlowId } from "~/domains/flowIds";
import { type UserDataWithPageData } from "~/services/flow/pageData";
import { type FlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { type StrapiResultPage } from "~/services/cms/models/StrapiResultPage";

// Information about the current result page, handed to a flow's optional hooks.
export type ResultExtrasContext = {
  request: Request;
  url: URL;
  flowId: FlowId;
  stepId: string;
  userData: UserDataWithPageData;
  flowSessionEngine: FlowSession<PageConfigMap>;
};

// Optional per-flow hooks. A flow that needs nothing beyond the shared behavior
// passes no extras and is served exactly as before. Plain text placeholders go
// through the flow's `stringReplacements`; this hook is only for content that a
// string replacement can't express.
export type ResultLoaderExtras = {
  // Rewrite the result page content after replacements (e.g. fill a CMS List
  // component with computed items). Receives and returns the same page shape.
  transformContent?: (
    content: StrapiResultPage,
    context: ResultExtrasContext,
  ) => StrapiResultPage | Promise<StrapiResultPage>;
};

export const loadResultData = async (
  args: LoaderFunctionArgs,
  extras?: ResultLoaderExtras,
) => {
  const { request, url } = args;

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

  const context: ResultExtrasContext = {
    request,
    url,
    flowId,
    stepId,
    userData,
    flowSessionEngine,
  };

  const replacements = replacementsFromFlowConfig(
    currentFlow.stringReplacements,
    userData,
  );

  const replacedContent = applyStringReplacement(
    resultPageContent,
    replacements,
  );
  const cmsContent = extras?.transformContent
    ? await extras.transformContent(replacedContent, context)
    : replacedContent;

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
    replacements,
  );

  return data({
    cmsContent: { ...cmsContent, nextSteps, documents, pageTitle },
    buttonNavigationProps,
  });
};
