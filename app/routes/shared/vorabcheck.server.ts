import { validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirectDocument } from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import {
  fetchFlowPage,
  fetchMeta,
  fetchTranslations,
} from "~/services/cms/index.server";
import { isStrapiHeadingComponent } from "~/services/cms/models/isStrapiHeadingComponent";
import { isStrapiSelectComponent } from "~/services/cms/models/isStrapiSelectComponent";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { logWarning } from "~/services/logging";
import { stepMeta } from "~/services/meta/formStepMeta";
import {
  skipFlowParamAllowedAndEnabled,
  parentFromParams,
} from "~/services/params";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import {
  getSessionData,
  getSessionManager,
  updateSession,
} from "~/services/session.server";
import { fieldsFromContext } from "~/services/session.server/fieldsFromContext";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { filterFormData } from "~/util/filterFormData";

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  const { pathname, searchParams } = new URL(request.url);
  const { flowId, stepId } = parsePathname(pathname);
  const cookieHeader = request.headers.get("Cookie");

  const { userData, debugId } = await getSessionData(flowId, cookieHeader);
  context.debugId = debugId; // For showing in errors

  const currentFlow = flows[flowId];
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: userData,
    guards: currentFlow.guards,
  });

  if (
    !flowController.isReachable(stepId) &&
    !skipFlowParamAllowedAndEnabled(searchParams)
  )
    return redirectDocument(flowController.getInitial());

  const [vorabcheckPage, parentMeta, translations] = await Promise.all([
    fetchFlowPage("vorab-check-pages", flowId, stepId),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
    fetchTranslations("defaultTranslations"),
  ]);

  // Do string replacement in content if necessary
  const contentElements = applyStringReplacement(
    vorabcheckPage.pre_form,
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userData)
      : undefined,
  );

  // Inject heading into <legend> inside radio groups
  // TODO: only do for pages with *one* select?
  const headings = contentElements.filter(isStrapiHeadingComponent);
  const formElements = vorabcheckPage.form.map((strapiFormElement) => {
    if (
      isStrapiSelectComponent(strapiFormElement) &&
      strapiFormElement.label === null &&
      headings.length > 0
    ) {
      strapiFormElement.altLabel = headings[0].text ?? null;
    }
    return strapiFormElement;
  });

  const meta = applyStringReplacement(
    stepMeta(vorabcheckPage.pageMeta, parentMeta),
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userData)
      : undefined,
  );

  // filter user data for current step
  const fieldNames = formElements.map((entry) => entry.name);
  const stepData = fieldsFromContext(userData, fieldNames);

  const { headers, csrf } = await updateMainSession({
    cookieHeader,
    flowId,
    stepId,
  });

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel: translations.backButtonDefaultLabel,
    nextButtonLabel:
      vorabcheckPage.nextButtonLabel ?? translations.nextButtonDefaultLabel,
    isFinal: flowController.isFinal(stepId),
    backDestination: flowController.getPrevious(stepId),
  });

  const progressProps = {
    ...flowController.getProgress(stepId),
    label: translations.progressBarLabel,
  };

  return data(
    {
      csrf,
      stepData,
      contentElements,
      formElements,
      meta,
      progressProps,
      buttonNavigationProps,
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
  const { flowId, stepId } = parsePathname(pathname);
  const sessionManager = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await sessionManager.getSession(cookieHeader);
  const formData = await request.formData();

  const relevantFormData = filterFormData(formData);
  const validationResult = await validateFormData(pathname, relevantFormData);
  if (validationResult.error)
    return validationError(
      validationResult.error,
      validationResult.submittedData,
    );

  updateSession(flowSession, validationResult.data);

  const flowController = buildFlowController({
    config: flows[flowId].config,
    data: flowSession.data,
    guards: flows[flowId].guards,
  });

  const customAnalyticsEventName =
    flowController.getMeta(stepId)?.customAnalyticsEventName;
  if (customAnalyticsEventName) {
    sendCustomAnalyticsEvent({
      request,
      eventName: customAnalyticsEventName,
      properties: validationResult.data,
    });
  }

  const destination =
    flowController.getNext(stepId) ?? flowController.getInitial();
  const headers = {
    "Set-Cookie": await sessionManager.commitSession(flowSession),
  };

  return redirectDocument(destination, { headers });
};
