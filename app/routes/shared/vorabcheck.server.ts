import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirectDocument } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { getSessionForContext, updateSession } from "~/services/session.server";
import {
  fetchCollectionEntry,
  fetchMeta,
  fetchTranslations,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { validateFormData } from "~/services/validation/validateFormData.server";
import type { Context } from "~/models/flows/contexts";
import { parsePathname } from "~/models/flows/contexts";
import { flows } from "~/models/flows/flows.server";
import { isStrapiSelectComponent } from "~/services/cms/models/StrapiSelect";
import {
  createCSRFToken,
  csrfSessionFromRequest,
  validatedSession,
} from "~/services/security/csrf.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { logError } from "~/services/logging";
import { lastStepKey } from "~/services/flow/constants";
import { sendCustomEvent } from "~/services/analytics/customEvent";
import { parentFromParams } from "~/services/params";
import { interpolateDeep } from "~/util/fillTemplate";
import _ from "lodash";
import { isStrapiHeadingComponent } from "~/services/cms/models/StrapiHeading";
import { buttonProps } from "~/util/buttonProps";
import { stepMeta } from "~/services/meta/formStepMeta";

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

  // get data from redis
  const { data, id } = await getSessionForContext(flowId).getSession(cookieId);
  const userDataFromRedis: Context = data; // Recast for now to get type safety
  context.sessionId = getSessionForContext(flowId).getSessionId(id); // For showing in errors

  // get flow controller
  const currentFlow = flows[flowId];
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: userDataFromRedis,
    guards: currentFlow.guards,
  });

  // check funnel logic -> Vorabcheck + Formular?
  if (!flowController.isReachable(stepId))
    return redirectDocument(flowController.getInitial().url);

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

  // update session with csrf
  const csrf = createCSRFToken();
  const session = await csrfSessionFromRequest(csrf, request);

  // update session with last valid step
  session.set(lastStepKey, { [flowId]: stepId });

  // set session in header
  const sessionContext = getSessionForContext("main");
  const headers = { "Set-Cookie": await sessionContext.commitSession(session) };

  // get navigation destinations + labels
  const buttonNavigationProps = {
    next: flowController.isFinal(stepId)
      ? undefined
      : buttonProps(
          vorabcheckPage.nextButtonLabel ??
            translations["nextButtonDefaultLabel"],
        ),
    back: buttonProps(
      translations["backButtonDefaultLabel"],
      flowController.getPrevious(stepId)?.url,
    ),
  };

  // get progress -> Vorabcheck
  const { total, current } = flowController.getProgress(stepId);
  const progressProps = {
    progress: current,
    max: total,
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
  if (customEventName)
    sendCustomEvent({
      request,
      eventName: customEventName,
      properties: validationResult.data,
    });

  const destination =
    flowController.getNext(stepId)?.url ?? flowController.getInitial().url;
  const headers = { "Set-Cookie": await commitSession(flowSession) };

  return redirectDocument(destination, { headers });
};
