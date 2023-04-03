import { useLoaderData, useParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import { formPages, allValidators } from "~/lib/vorabcheck/pages";
import type { AllowedIDs } from "~/lib/vorabcheck/pages";
import {
  initialStepID,
  progress,
  formGraph,
} from "~/lib/vorabcheck/flow.server";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { commitSession, getSession } from "~/sessions";
import {
  findPreviousStep,
  isLeaf,
  isValidContext,
} from "~/lib/treeCalculations";
import { getPageConfig } from "~/services/cms/getPageConfig";
import PageContent from "~/components/PageContent";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: data.meta?.title },
];

export const loader: LoaderFunction = async ({ params, request }) => {
  const stepID = params.stepID as AllowedIDs;
  if (!formGraph.hasNode(stepID)) {
    return redirect(`/vorabcheck/${initialStepID}`);
  }
  const page = await getPageConfig(request.url);
  const session = await getSession(request.headers.get("Cookie"));

  if (!isValidContext(initialStepID, stepID, formGraph, session.data)) {
    return redirect(`/vorabcheck/${initialStepID}`);
  }

  return json({
    defaultValues: session.data[stepID],
    preFormContent: page?.pre_form,
    formContent: page?.form,
    meta: page?.meta,
    progressStep: progress[stepID],
    progressTotal: progress[initialStepID],
    isLast: isLeaf(stepID, formGraph),
    previousStep: findPreviousStep(stepID, formGraph, session.data)[0],
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const stepID = params.stepID as AllowedIDs;
  const validationResult = await allValidators[stepID].validate(formData);
  if (validationResult.error) return validationError(validationResult.error);
  session.set(stepID, validationResult.data);

  // Deciding the next step
  // 1. Default: back to initial
  let destinationString: AllowedIDs = initialStepID;
  for (const link of formGraph.outEdgeEntries(stepID)) {
    // 2. For each outgoing link: check if theres a condition and whether its fullfilled
    if (
      !link.attributes["condition"] ||
      link.attributes["condition"](session.data)
    ) {
      destinationString = link.target as AllowedIDs;
      break;
    }
  }
  const headers = { "Set-Cookie": await commitSession(session) };
  return redirect(`/vorabcheck/${destinationString}`, { status: 302, headers });
};

export default function Index() {
  const {
    defaultValues,
    preFormContent,
    formContent,
    progressStep,
    progressTotal,
    isLast,
    previousStep,
  } = useLoaderData<typeof loader>();
  const params = useParams();
  const stepID = params.stepID as AllowedIDs;
  const FormInputComponent = formPages[stepID].component;

  return (
    <div>
      <PageContent content={preFormContent} />
      <div>
        <ValidatedForm
          key={`${stepID}_form`}
          method="post"
          validator={allValidators[stepID]}
          defaultValues={defaultValues}
        >
          <FormInputComponent content={formContent} />
          {!isLast &&
            `Schritt ${progressTotal - progressStep + 1} / ${progressTotal}`}
          <ButtonNavigation backDestination={previousStep} isLast={isLast} />
        </ValidatedForm>
      </div>
    </div>
  );
}
