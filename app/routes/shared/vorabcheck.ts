import { validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirectDocument } from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { getPageSchema } from "~/domains/pageSchemas";
import { getFieldsByFormElements } from "~/services/cms/getFieldsByFormElements";
import { fetchFlowPage, fetchMeta } from "~/services/cms/index.server";
import { isStrapiHeadingComponent } from "~/services/cms/models/isStrapiHeadingComponent";
import { isStrapiSelectComponent } from "~/services/cms/models/isStrapiSelectComponent";
import { getUserDataAndFlow } from "~/services/flow/userDataAndFlow/getUserDataAndFlow";
import { flowDestination } from "~/services/flow/userFlowAction/flowDestination";
import { postValidationFlowAction } from "~/services/flow/userFlowAction/postValidationFlowAction";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { logWarning } from "~/services/logging";
import { stepMeta } from "~/services/meta/formStepMeta";
import { parentFromParams } from "~/services/params";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import { fieldsFromContext } from "~/services/session.server/fieldsFromContext";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { translations } from "~/services/translations/translations";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { getButtonNavigationProps } from "~/util/buttonProps";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";
import { shouldShowReportProblem } from "../../components/reportProblem/showReportProblem";

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

  const [vorabcheckPage, parentMeta] = await Promise.all([
    fetchFlowPage("vorab-check-pages", flowId, stepId),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
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
      strapiFormElement.altLabel = headings[0].text;
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
  const pageSchema = getPageSchema(pathname);
  const fieldNames = pageSchema
    ? Object.keys(pageSchema)
    : getFieldsByFormElements(formElements);
  const stepData = fieldsFromContext(userData, fieldNames);

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

  return data(
    {
      csrf,
      stepData,
      contentElements,
      formElements,
      meta,
      progressProps,
      buttonNavigationProps,
      showReportProblem: shouldShowReportProblem(flowId, stepId),
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

  await postValidationFlowAction(request, resultFormUserData.value.userData);

  const destination = flowDestination(pathname, flowSession.data);
  const headers = { "Set-Cookie": await commitSession(flowSession) };
  return redirectDocument(destination, { headers });
};
