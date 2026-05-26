import {
  data,
  type ActionFunctionArgs,
  redirectDocument,
  type LoaderFunctionArgs,
  redirect,
} from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { nachlassErbfolgeStaticFlow } from "~/domains/nachlass/erbschein/erbfolge/flowConfig";
import type { ArrayData, UserData } from "~/domains/userData";
import type { Replacements } from "~/util/applyStringReplacement";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import { fetchFlowPage } from "~/services/cms/index.server";
import { buildFormElements } from "~/services/flow/formular/contentData/buildFormElements";
import { structureCmsContent } from "~/services/flow/formular/buildCmsContentAndTranslations";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import {
  getSessionData,
  getSessionManager,
  updateSession,
} from "~/services/session.server";
import { resolveUserData } from "~/services/session.server/resolveUserData";
import { getButtonNavigationProps } from "~/util/buttonProps";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";

const staticFlow = nachlassErbfolgeStaticFlow;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const fullUserData = addPageDataToUserData(
    await getSessionData(flowId, cookieHeader),
    { arrayIndexes },
  );

  const flowSession = createFlowSession(staticFlow, fullUserData, stepId);

  if (!flowSession.isReachable(stepId)) {
    return redirect(flowId + flowSession.initialPath);
  }

  const { arrayInfo, fieldNames } = flowSession;

  const fieldNamesForPage = arrayInfo
    ? [...fieldNames, arrayInfo.name]
    : fieldNames;

  const stepData = resolveUserData(
    { ...flowSession.prunedUserData, pageData: fullUserData.pageData } as Parameters<typeof resolveUserData>[0],
    fieldNamesForPage,
  );

  // Resolve parent array item name fields (e.g. kinder#name for /kinder/#/enkelkinder)
  // so Strapi content can use {{kinder#name}} in headings on nested pages.
  const parentNameFields = [
    ...new Set(
      fieldNames
        .filter((f) => f.includes("#"))
        .flatMap((f) => {
          const parts = f.split("#");
          return parts.slice(0, -1).map((_, i) =>
            parts.slice(0, i + 1).join("#") + "#name",
          );
        })
        .filter((f) => !fieldNamesForPage.includes(f)),
    ),
  ];
  const parentNameData =
    parentNameFields.length > 0
      ? resolveUserData(
          { ...flowSession.prunedUserData, pageData: fullUserData.pageData } as Parameters<typeof resolveUserData>[0],
          parentNameFields,
        )
      : {};

  const cmsContent = applyStringReplacement(
    await fetchFlowPage("vorab-check-pages", flowId, stepId.replaceAll("/#", "")),
    { ...flowSession.prunedUserData, ...parentNameData } as Replacements,
  );
  const formElements = buildFormElements(structureCmsContent(cmsContent), {
    ...stepData,
    pageData: fullUserData.pageData,
  });

  const prevStepId = flowSession.prevPath;
  const backDestination = prevStepId
    ? flowId + resolveArrayCharacter(prevStepId, arrayIndexes, false)
    : undefined;

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel: "Zurück",
    nextButtonLabel: cmsContent.nextButtonLabel ?? "Weiter",
    isFinal: staticFlow.isFinal(stepId),
    backDestination,
  });

  const arraySummaryData =
    arrayInfo?.entryPoint !== undefined
      ? {
        category: arrayInfo.name,
        arrayData: {
          data: (stepData[arrayInfo.name] ?? []) as ArrayData,
          configuration: {
            url: flowId + resolveArrayCharacter(stepId, arrayIndexes, false),
            initialInputUrl: arrayInfo.entryPoint,
            disableAddButton: false,
          },
        },
        content: {
          buttonLabel: arrayInfo.name.split("#").at(-1)!,
          itemLabels: { label: "itemLabel" },
        },
      }
      : undefined;

  return data({
    arraySummaryData,
    stepData,
    cmsContent,
    formElements,
    progressProps: staticFlow.getProgress(stepId),
    buttonNavigationProps,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const { pathname } = new URL(request.url);
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const formData = await request.formData();
  const submittedData = Object.fromEntries(
    [...formData].filter(([key]) => !key.startsWith("_")),
  );
  const pageSchema = staticFlow.getSchema(stepId);
  if (!pageSchema) return;
  const validatedFormSubmission = pageSchema.safeParse(submittedData);
  if (!validatedFormSubmission.success) return;

  const resolvedData = resolveArraysFromKeys(
    validatedFormSubmission.data as UserData,
    arrayIndexes,
  );

  updateSession(flowSession, resolvedData);

  const fullUserData = addPageDataToUserData(flowSession.data, { arrayIndexes });
  const sessionManager = createFlowSession(staticFlow, fullUserData, stepId);

  const nextStepId = sessionManager.nextPath;
  if (!nextStepId) throw new Error("no nextStepId");
  const destination =
    flowId + resolveArrayCharacter(nextStepId, arrayIndexes, false);

  const headers = await commitSession(flowSession);
  return redirectDocument(destination, { headers });
};
