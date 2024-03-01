import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirectDocument } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  getSessionData,
  getSessionForContext,
  updateSession,
} from "~/services/session.server";
import {
  fetchCollectionEntry,
  fetchMeta,
  fetchTranslations,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { parsePathname } from "~/models/flows/contexts";
import { flows } from "~/models/flows/flows.server";
import { isStrapiSelectComponent } from "~/services/cms/models/StrapiSelect";
import { validatedSession } from "~/services/security/csrf.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { logError } from "~/services/logging";
import { sendCustomEvent } from "~/services/analytics/customEvent";
import { parentFromParams } from "~/services/params";
import { interpolateDeep } from "~/util/fillTemplate";
import _ from "lodash";
import { isStrapiHeadingComponent } from "~/services/cms/models/StrapiHeading";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { stepMeta } from "~/services/meta/formStepMeta";
import { getProgressProps } from "~/services/flow/server/progress";
import { updateSessionInHeader } from "~/services/session.server/updateSessionInHeader";

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled(request);

  // get data from request
  const { pathname } = new URL(request.url);
  const { flowId, stepId } = parsePathname(pathname);
  const cookieId = request.headers.get("Cookie");

  const { userDataFromRedis, sessionId } = await getSessionData(
    flowId,
    cookieId,
  );
  context.sessionId = sessionId; // For showing in errors

  // get flow controller
  const currentFlow = flows[flowId];
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: userDataFromRedis,
    guards: currentFlow.guards,
  });

  // check funnel logic -> Vorabcheck + Formular?
  if (!flowController.isReachable(stepId))
    return redirectDocument(flowController.getInitial());

  // get all relevant strapi data
  const [vorabcheckPage, parentMeta, translations] = await Promise.all([
    fetchCollectionEntry("vorab-check-pages", pathname),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
    fetchTranslations("defaultTranslations"),
  ]);

  //  Do string replacement in content if necessary
  const contentElements = interpolateDeep(
    vorabcheckPage.pre_form,
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userDataFromRedis)
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

  // get meta content for step, used in breadcrumbs -> actually only Vorabcheck, *but* used in root.tsx
  const meta = stepMeta(vorabcheckPage.meta, parentMeta);

  // filter user data for current step
  const fieldNames = formElements.map((entry) => entry.name);
  const stepData = _.pick(userDataFromRedis, fieldNames);

  const { headers, csrf } = await updateSessionInHeader({
    request,
    flowId,
    stepId,
  });

  const buttonNavigationProps = getButtonNavigationProps({
    flowController,
    stepId,
    nextButtonLabel: vorabcheckPage.nextButtonLabel,
    defaultStrings: translations,
  });
  console.log({ buttonNavigationProps });

  const progressProps = getProgressProps({
    flowController,
    stepId,
    progressBarLabel: translations["progressBarLabel"],
  });

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
  const { getSession, commitSession } = getSessionForContext(flowId);
  const cookieId = request.headers.get("Cookie");
  const flowSession = await getSession(cookieId);

  const formData = await request.formData();

  // Note: This also reduces same-named fields to the last entry
  const relevantFormData = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => !key.startsWith("_")),
  );

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

  const customEventName = flowController.getMeta(stepId)?.customEventName;
  if (customEventName) {
    sendCustomEvent({
      request,
      eventName: customEventName,
      properties: validationResult.data,
    });
  }

  const destination =
    flowController.getNext(stepId) ?? flowController.getInitial();
  const headers = { "Set-Cookie": await commitSession(flowSession) };

  return redirectDocument(destination, { headers });
};
