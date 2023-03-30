import { useLoaderData, useParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import type { AllowedIDs } from "~/lib/vorabcheck";
import {
  initialStepID,
  allValidators,
  progress,
  formGraph,
  formPages,
} from "~/lib/vorabcheck";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { commitSession, getSession } from "~/sessions";
import { findPreviousStep, isLeaf } from "~/lib/treeCalculations";
import { getPageConfig } from "~/services/cms/getPageConfig";
import PageContent from "~/components/PageContent";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: data.meta?.title },
];

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!formGraph.hasNode(params.formStepID)) {
    return redirect(`/vorabcheck/${initialStepID}`);
  }
  const page = await getPageConfig(request.url, { dontThrow: true });
  const session = await getSession(request.headers.get("Cookie"));

  return json({
    context: session.data,
    preFormContent: page?.pre_form,
    formContent: page?.form,
    meta: page?.meta,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const stepID = params.formStepID as AllowedIDs;
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
  return redirect(`/vorabcheck/${destinationString}`, { headers });
};

export default function Index() {
  const { context, preFormContent, formContent } =
    useLoaderData<typeof loader>();
  const params = useParams();
  const stepID = params.formStepID as AllowedIDs;
  const FormInputComponent = formPages[stepID].component;
  const pessimisticPath = progress[stepID] ?? 0;
  const pessimisticPathTotal = progress[initialStepID] ?? 0;
  const isLast = isLeaf(stepID, formGraph);

  return (
    <div>
      <PageContent content={preFormContent} />
      <div>
        <ValidatedForm
          key={`${stepID}_form`}
          method="post"
          validator={allValidators[stepID]}
          defaultValues={context[stepID]}
        >
          <FormInputComponent content={formContent} />
          {!isLast &&
            `Schritt ${
              pessimisticPathTotal - pessimisticPath + 1
            } / ${pessimisticPathTotal}`}
          <ButtonNavigation
            backDestination={findPreviousStep(stepID, formGraph, context)[0]}
            isLast={isLast}
          />
        </ValidatedForm>
      </div>
    </div>
  );
}
