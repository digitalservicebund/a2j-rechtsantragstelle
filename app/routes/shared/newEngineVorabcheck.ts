import { validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirectDocument } from "react-router";
import { retrieveContentData } from "~/services/flow/contentData/retrieveContentData";
import { postValidationFlowAction } from "~/services/flow/userFlowAction/postValidationFlowAction";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";
import { shouldShowReportProblem } from "~/components/content/reportProblem/showReportProblem";
import { getPageAndFlowDataFromPathname } from "~/services/flow/getPageAndFlowDataFromPathname";
import { getUserDataAndFlowNewEngine } from "~/services/flow/userDataAndFlow/getUserDataAndFlowNewEngine";
import { flowDestinationNewEngine } from "~/services/flow/userFlowAction/flowDestinationNewEngine";
import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { config } from "~/services/env/public";
import {
  loader as loaderVorabcheck,
  action as actionVorabcheck,
} from "./vorabcheck";

export const loader = async (args: LoaderFunctionArgs) => {
  if (
    config().ENVIRONMENT === "production" ||
    config().ENVIRONMENT === "preview"
  ) {
    return await loaderVorabcheck(args);
  }

  const { params, request, url } = args;

  const resultUserAndFlow = await getUserDataAndFlowNewEngine(request, url);

  if (resultUserAndFlow.isErr) {
    return redirectDocument(resultUserAndFlow.error.redirectTo);
  }

  const {
    userData,
    flow: { id: flowId, flowSessionEngine },
    page: { stepId },
  } = resultUserAndFlow.value;

  const { pathname } = url;

  const contentData = await retrieveContentData(
    "vorab-check-pages",
    pathname,
    params,
    userData,
  );

  const cmsContent = contentData.getCMSContent();
  const formElements = contentData.getFormElements(flowId);
  const stepData = contentData.getStepData();
  const buttonNavigationProps = contentData.getButtonNavigationNewEngine(
    flowId,
    flowSessionEngine,
  );
  const progressProps = contentData.getProgressNewEngine(
    flowSessionEngine,
    stepId,
  );

  return data({
    stepData,
    cmsContent,
    formElements,
    progressProps,
    buttonNavigationProps,
    showReportProblem: shouldShowReportProblem(stepId),
  });
};

export const action = async (args: ActionFunctionArgs) => {
  if (
    config().ENVIRONMENT === "production" ||
    config().ENVIRONMENT === "preview"
  ) {
    return await actionVorabcheck(args);
  }

  const { request, url } = args;

  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const { pathname } = url;
  const { flowId, currentFlow, stepId } =
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

  const flowSessionEngineSaved = createFlowSession(
    compiledStaticFlow,
    flowSession.data as Parameters<typeof createFlowSession>[1],
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
