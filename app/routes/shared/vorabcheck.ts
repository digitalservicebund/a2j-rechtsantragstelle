import { validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirectDocument } from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { getPageSchema } from "~/domains/pageSchemas";
import {
  fetchFlowPage,
  fetchContentPageMeta,
} from "~/services/cms/index.server";
import { isStrapiSelectComponent } from "~/services/cms/models/formElements/isStrapiSelectComponent";
import { isStrapiHeadingComponent } from "~/services/cms/models/isStrapiHeadingComponent";
import { getUserDataAndFlow } from "~/services/flow/userDataAndFlow/getUserDataAndFlow";
import { flowDestination } from "~/services/flow/userFlowAction/flowDestination";
import { postValidationFlowAction } from "~/services/flow/userFlowAction/postValidationFlowAction";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { logWarning } from "~/services/logging";
import { parentFromParams } from "~/services/params";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import { resolveUserData } from "~/services/session.server/resolveUserData";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { translations } from "~/services/translations/translations";
import {
  applyStringReplacement,
  replacementsFromFlowConfig,
} from "~/util/applyStringReplacement";
import { getButtonNavigationProps } from "~/util/buttonProps";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";
import { shouldShowReportProblem } from "../../components/reportProblem/showReportProblem";
import { composePageTitle } from "~/services/meta/composePageTitle";
import { pruneIrrelevantData } from "~/services/flow/pruner/pruner";
import { buildFormElements } from "~/services/flow/formular/contentData/buildFormElements";
import { structureCmsContent } from "~/services/flow/formular/buildCmsContentAndTranslations";

type VorabcheckArraySummaryItem = {
  category: string;
  itemTitle: string;
  displayFields: [string, string][];
  valueLabels: Record<string, string>;
  items: unknown[];
  expectedCount?: number;
  baseUrl: string;
};

function parseExpectedCount(countValue: unknown) {
  if (typeof countValue === "string") {
    return Number.parseInt(countValue, 10);
  }

  if (typeof countValue === "number") {
    return countValue;
  }

  return undefined;
}

function getVorabcheckArraySummaryData(
  preFormContent: Array<{ __component: string; [key: string]: unknown }>,
  userData: Record<string, unknown>,
  flowId: string,
): VorabcheckArraySummaryItem[] {
  return preFormContent
    .filter((item) => item.__component === "page.array-summary")
    .map((item) => {
      const category = String(item.category);
      const rawItemLabels = item.itemLabels as Record<string, string>;

      return {
        category,
        itemTitle:
          typeof item.subtitle === "object" &&
          item.subtitle &&
          "text" in item.subtitle &&
          typeof item.subtitle.text === "string"
            ? item.subtitle.text.replace("{{indexArray}}", "{{index}}")
            : `${String(item.buttonLabel)} {{index}}`,
        displayFields: Object.entries(rawItemLabels).filter(
          ([key]) => !key.includes("."),
        ) as [string, string][],
        valueLabels: Object.fromEntries(
          Object.entries(rawItemLabels).filter(([key]) => key.includes(".")),
        ),
        items: Array.isArray(userData[category])
          ? (userData[category] as unknown[])
          : [],
        expectedCount: parseExpectedCount(userData[`${category}Anzahl`]),
        baseUrl: `${flowId}${String(item.categoryUrl)}`,
      };
    });
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const resultUserAndFlow = await getUserDataAndFlow(request);

  if (resultUserAndFlow.isErr) {
    return redirectDocument(resultUserAndFlow.error.redirectTo);
  }

  const {
    userData,
    flow: { id: flowId, controller: flowController },
    page: { stepId },
  } = resultUserAndFlow.value;

  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const currentFlow = flows[flowId];

  const [vorabcheckPage, parentContentPageMeta] = await Promise.all([
    fetchFlowPage("vorab-check-pages", flowId, stepId),
    fetchContentPageMeta({ filterValue: parentFromParams(pathname, params) }),
  ]);

  // Do string replacement in content if necessary
  const cmsContent = applyStringReplacement(
    vorabcheckPage,
    replacementsFromFlowConfig(currentFlow.stringReplacements, userData),
  );

  // Inject heading into <legend> inside radio groups
  // TODO: only do for pages with *one* select?
  const headings = cmsContent.pre_form.filter(isStrapiHeadingComponent);
  const formElements = buildFormElements(
    structureCmsContent(cmsContent),
    userData,
  ).map((strapiFormElement) => {
    if (
      isStrapiSelectComponent(strapiFormElement) &&
      !strapiFormElement.label &&
      headings.length > 0
    ) {
      strapiFormElement.altLabel = headings[0].text;
    }
    return strapiFormElement;
  });

  const pageTitle = applyStringReplacement(
    composePageTitle(vorabcheckPage.pageTitle, parentContentPageMeta),
    replacementsFromFlowConfig(currentFlow.stringReplacements, userData),
  );

  // filter user data for current step
  const pageSchema = getPageSchema(pathname);
  const fieldNames = pageSchema ? Object.keys(pageSchema) : [];
  const stepData = resolveUserData(userData, fieldNames);

  const { headers, csrf } = await updateMainSession({
    cookieHeader,
    flowId,
    stepId,
  });

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel: translations.buttonNavigation.backButtonDefaultLabel.de,
    nextButtonLabel:
      vorabcheckPage.nextButtonLabel ??
      translations.buttonNavigation.nextButtonDefaultLabel.de,
    isFinal: flowController.isFinal(stepId),
    backDestination: flowController.getPrevious(stepId),
  });

  const progressProps = {
    ...flowController.getProgress(stepId),
    label: translations.vorabcheck.progressBarLabel.de,
  };

  const arraySummaryData = getVorabcheckArraySummaryData(
    cmsContent.pre_form as Array<{
      __component: string;
      [key: string]: unknown;
    }>,
    userData as Record<string, unknown>,
    flowId,
  );

  return data(
    {
      csrf,
      stepData,
      cmsContent: { ...cmsContent, pageTitle },
      formElements,
      arraySummaryData,
      progressProps,
      buttonNavigationProps,
      showReportProblem: shouldShowReportProblem(stepId),
    },
    { headers },
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const formData = await request.formData();

  const resultFormUserData = await validateFormUserData(
    formData,
    pathname,
    cookieHeader,
  );

  if (resultFormUserData.isErr) {
    return validationError(
      resultFormUserData.error.error,
      resultFormUserData.error.submittedData,
    );
  }

  updateSession(flowSession, resultFormUserData.value.userData);

  const { prunedData } = pruneIrrelevantData(flowSession.data, flowId);

  await postValidationFlowAction(request, prunedData);

  const destination = flowDestination(pathname, prunedData);
  const headers = { "Set-Cookie": await commitSession(flowSession) };
  return redirectDocument(destination, { headers });
};
