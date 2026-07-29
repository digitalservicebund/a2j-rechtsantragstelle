import { validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirectDocument } from "react-router";
import { retrieveContentData } from "~/services/flow/contentData/retrieveContentData";
import { postValidationFlowAction } from "~/services/flow/userFlowAction/postValidationFlowAction";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import { shouldShowReportProblem } from "~/components/content/reportProblem/showReportProblem";
import { getPageAndFlowDataFromPathname } from "~/services/flow/getPageAndFlowDataFromPathname";
import { getUserDataAndFlowNewEngine } from "~/services/flow/userDataAndFlow/getUserDataAndFlowNewEngine";
import { flowDestinationNewEngine } from "~/services/flow/userFlowAction/flowDestinationNewEngine";
import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { type FlowId } from "~/domains/flowIds";
import { type UserDataWithPageData } from "~/services/flow/pageData";
import { type FlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";
import { type Replacements } from "~/util/applyStringReplacement";
import { type StrapiFormComponent } from "~/services/cms/models/formElements/StrapiFormComponent";

// Information about the current page, handed to a flow's optional loader hooks
// so they can compute page-specific extras (e.g. which list item the user is in).
export type VorabcheckExtrasContext = {
  request: Request;
  url: URL;
  flowId: FlowId;
  stepId: string;
  arrayIndexes?: number[];
  userData: UserDataWithPageData;
  flowSessionEngine: FlowSession<PageConfigMap>;
};

// Optional per-flow hooks. A flow that needs nothing beyond the shared behavior
// passes no extras and is served exactly as before.
export type VorabcheckLoaderExtras<
  ExtraData extends Record<string, unknown> = Record<string, never>,
> = {
  // Extra CMS text placeholders that depend on the current page. Merged into the
  // content after the flow's static replacements, so these win.
  buildReplacements?: (
    context: VorabcheckExtrasContext,
  ) => Replacements | Promise<Replacements>;
  // Extra values to add to the loader's returned data (and, if it returns a
  // `formElements` field, a replacement for the default form elements). Runs
  // after the content is built, so it receives the default form elements to extend.
  buildLoaderData?: (
    context: VorabcheckExtrasContext & {
      formElements: StrapiFormComponent[];
    },
  ) => ExtraData | Promise<ExtraData>;
};

export const loadVorabcheckData = async <
  ExtraData extends Record<string, unknown> = Record<string, never>,
>(
  args: LoaderFunctionArgs,
  extras?: VorabcheckLoaderExtras<ExtraData>,
) => {
  const { params, request, url } = args;

  const resultUserAndFlow = await getUserDataAndFlowNewEngine(request, url);

  if (resultUserAndFlow.isErr) {
    return redirectDocument(resultUserAndFlow.error.redirectTo);
  }

  const {
    userData,
    flow: { id: flowId, flowSessionEngine },
    page: { stepId, arrayIndexes },
  } = resultUserAndFlow.value;

  const { pathname } = url;

  const context: VorabcheckExtrasContext = {
    request,
    url,
    flowId,
    stepId,
    arrayIndexes,
    userData,
    flowSessionEngine,
  };

  const extraReplacements = await extras?.buildReplacements?.(context);

  const contentData = await retrieveContentData(
    "vorab-check-pages",
    pathname,
    params,
    userData,
    undefined,
    extraReplacements,
  );

  const cmsContent = contentData.getCMSContent();
  const formElements = contentData.getFormElements(flowId);
  const stepData = contentData.getStepData();
  const buttonNavigationProps = contentData.getButtonNavigationNewEngine(
    flowId,
    flowSessionEngine,
    arrayIndexes,
  );
  const progressProps = contentData.getProgressNewEngine(
    flowSessionEngine,
    stepId,
  );

  const extraData = await extras?.buildLoaderData?.({
    ...context,
    formElements,
  });

  return data({
    stepData,
    cmsContent,
    formElements,
    progressProps,
    buttonNavigationProps,
    showReportProblem: shouldShowReportProblem(stepId),
    // Cast keeps the extra fields in the return type. Spreading the raw
    // `ExtraData | undefined` would otherwise erase them; at runtime `undefined`
    // simply spreads to nothing, which is the no-extras case.
    ...(extraData as ExtraData),
  });
};

export const runVorabcheckAction = async (args: ActionFunctionArgs) => {
  const { request, url } = args;

  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const { pathname } = url;
  const { flowId, currentFlow, stepId, arrayIndexes } =
    getPageAndFlowDataFromPathname(pathname);

  const compiledStaticFlow =
    "newEngineConfig" in currentFlow ? currentFlow.newEngineConfig : undefined;

  // TODO - Remove this check later, once we migrated all the flows to the new engine
  if (!compiledStaticFlow) {
    throw new Response(null, { status: 404 });
  }

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

  // Mirror the loader (getSessionAndEngine): the guards that pick the next step
  // read pageData.arrayIndexes to resolve which array item was just submitted, so
  // they must be derived from the URL before the engine evaluates the transition.
  const fullUserData = addPageDataToUserData(flowSession.data, { arrayIndexes });

  const flowSessionEngineSaved = createFlowSession(
    compiledStaticFlow,
    fullUserData as Parameters<typeof createFlowSession>[1],
    stepId,
  );

  await postValidationFlowAction(
    request,
    flowSessionEngineSaved.prunedUserData,
    flowSession,
    url,
  );

  const destination = flowDestinationNewEngine(
    pathname,
    flowSessionEngineSaved,
  );
  const headers = await commitSession(flowSession);
  return redirectDocument(destination, { headers });
};
