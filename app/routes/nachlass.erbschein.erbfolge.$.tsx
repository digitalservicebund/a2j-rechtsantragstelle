import {
  data,
  type ActionFunctionArgs,
  redirectDocument,
  type LoaderFunctionArgs,
  redirect,
} from "react-router";
import { throw404OnProduction } from "~/services/errorPages/throw404";
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
import { useLoaderData } from "react-router";
import ContentComponents from "~/components/content/ContentComponents";
import { useFocusFirstH1 } from "~/components/hooks/useFocusFirstH1";
import { GridSection } from "~/components/layout/grid/GridSection";
import { Grid } from "~/components/layout/grid/Grid";
import { GridItem } from "~/components/layout/grid/GridItem";
import ValidatedFlowForm from "~/components/formElements/ValidatedFormFlow";
import { ProgressBar } from "~/components/layout/ProgressBar";
import { KinderSummary } from "~/domains/nachlass/erbschein/erbfolge/components/KinderSummary";
import { ElternteilSummary } from "~/domains/nachlass/erbschein/erbfolge/components/ElternteilSummary";
function NachlassErbfolgePage() {
  const {
    stepData,
    cmsContent,
    formElements,
    progressProps,
    buttonNavigationProps,
    arraySummaryData,
  } = useLoaderData<typeof loader>();

  useFocusFirstH1();

  return (
    <GridSection className="bg-kern-neutral-025">
      <Grid>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 9 }}
          xlColumn={{ start: 3, span: 9 }}
          className="pt-40 pb-kern-space-x-large"
          row={1}
        >
          <ProgressBar progress={progressProps?.progress ?? 0} max={progressProps?.max ?? 0} />
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          className="gap-kern-space-x-large flex flex-col"
          row={2}
          id="flow-page-content"
        >
          <ContentComponents content={cmsContent && "pre_form" in cmsContent ? cmsContent.pre_form : []} managedByParent />
          {arraySummaryData && arraySummaryData.category === "elternteile" && (
            <ElternteilSummary
              data={arraySummaryData.arrayData.data as ArrayData}
              configuration={arraySummaryData.arrayData.configuration}
            />
          )}
          {arraySummaryData && arraySummaryData.category !== "elternteile" && (
            <KinderSummary
              data={arraySummaryData.arrayData.data as ArrayData}
              configuration={arraySummaryData.arrayData.configuration}
              category={arraySummaryData.category}
            />
          )}
        </GridItem>
        <GridItem
          mdColumn={{ start: 1, span: 8 }}
          lgColumn={{ start: 3, span: 8 }}
          xlColumn={{ start: 3, span: 8 }}
          row={3}
          className="pb-80"
        >
          <ValidatedFlowForm
            stepData={stepData}
            formElements={formElements}
            buttonNavigationProps={buttonNavigationProps}
          />
        </GridItem>
      </Grid>
    </GridSection>
  );
}

export default NachlassErbfolgePage;

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

  const flowSession = createFlowSession(staticFlow, fullUserData as Parameters<typeof createFlowSession>[1], stepId);

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
  // Also include arrayInfo.name so array summary pages (which have no pageSchema fieldNames)
  // can still get their ancestor names (e.g. kinder#name on /kinder/#/kinder).
  const sourceFields = [
    ...fieldNames,
    ...(arrayInfo?.name.includes("#") ? [arrayInfo.name] : []),
  ];
  const parentNameFields = [
    ...new Set(
      sourceFields
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

  const cmsStepId = stepId.replaceAll("/#", "");
  const replacements = { ...flowSession.prunedUserData, ...parentNameData } as Replacements;

  const prevStepId = flowSession.prevPath;
  const backDestination = prevStepId
    ? flowId + resolveArrayCharacter(prevStepId, arrayIndexes, false)
    : undefined;

  const vorabPage = applyStringReplacement(
    await fetchFlowPage("vorab-check-pages", flowId, cmsStepId),
    replacements,
  );
  const formElements = buildFormElements(structureCmsContent(vorabPage), {
    ...stepData,
    pageData: fullUserData.pageData,
  });

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel: "Zurück",
    nextButtonLabel: vorabPage.nextButtonLabel ?? "Weiter",
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
    cmsContent: vorabPage,
    formElements,
    progressProps: staticFlow.getProgress(stepId),
    buttonNavigationProps,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  throw404OnProduction();
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
  const sessionManager = createFlowSession(staticFlow, fullUserData as Parameters<typeof createFlowSession>[1], stepId);

  const nextStepId = sessionManager.nextPath;
  if (!nextStepId) throw new Error("no nextStepId");
  const destination =
    flowId + resolveArrayCharacter(nextStepId, arrayIndexes, false);

  const headers = await commitSession(flowSession);
  return redirectDocument(destination, { headers });
};
