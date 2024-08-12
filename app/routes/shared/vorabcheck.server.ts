import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirectDocument } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { parsePathname } from "~/flows/flowIds";
import { flows } from "~/flows/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { isStrapiSelectComponent } from "~/services/cms/components/StrapiSelect";
import {
  fetchFlowPage,
  fetchMeta,
  fetchTranslations,
} from "~/services/cms/index.server";
import { isStrapiHeadingComponent } from "~/services/cms/models/StrapiHeading";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { logError } from "~/services/logging";
import { stepMeta } from "~/services/meta/formStepMeta";
import { parentFromParams } from "~/services/params";
import { validatedSession } from "~/services/security/csrf.server";
import {
  getSessionData,
  getSessionManager,
  updateSession,
} from "~/services/session.server";
import { fieldsFromContext } from "~/services/session.server/fieldsFromContext";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { interpolateDeep } from "~/util/fillTemplate";
import { filterFormData } from "~/util/filterFormData";

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
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

  if (!flowController.isReachable(stepId))
    return redirectDocument(flowController.getInitial());

  const [vorabcheckPage, parentMeta, translations, flowTranslations] =
    await Promise.all([
      fetchFlowPage("vorab-check-pages", flowId, stepId),
      fetchMeta({ filterValue: parentFromParams(pathname, params) }),
      fetchTranslations("defaultTranslations"),
      fetchTranslations(flowId),
    ]);

  // Do string replacement in content if necessary
  const contentElements = interpolateDeep(
    vorabcheckPage.pre_form,
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userData, flowTranslations)
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
      strapiFormElement.altLabel = headings[0].text;
    }
    return strapiFormElement;
  });

  const meta = stepMeta(vorabcheckPage.meta, parentMeta);

  // filter user data for current step
  const fieldNames = formElements.map((entry) => entry.name);
  const stepData = fieldsFromContext(userData, fieldNames);

  const { headers, csrf } = await updateMainSession({
    cookieHeader,
    flowId,
    stepId,
  });

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel: translations["backButtonDefaultLabel"],
    nextButtonLabel:
      vorabcheckPage.nextButtonLabel ?? translations["nextButtonDefaultLabel"],
    isFinal: flowController.isFinal(stepId),
    backDestination: flowController.getPrevious(stepId),
  });

  const progressProps = {
    ...flowController.getProgress(stepId),
    label: translations["progressBarLabel"],
  };

  return json(
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
  try {
    await validatedSession(request);
  } catch (csrfError) {
    logError({ error: csrfError });
    throw new Response(null, { status: 403 });
  }

  const { pathname } = new URL(request.url);
  const { flowId, stepId } = parsePathname(pathname);
  const sessionManager = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await sessionManager.getSession(cookieHeader);
  const formData = await request.formData();

  const relevantFormData = filterFormData(formData);
  const validationResult = await validateFormData(flowId, relevantFormData);
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
