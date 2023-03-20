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
import { isStepComponentWithSchema } from "~/components/form/steps";
import { findPreviousStep, isLeaf } from "~/lib/treeCalculations";
import getPageConfig from "~/services/cms/getPageConfig";
import PageContent from "~/components/PageContent";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: data.title },
];

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.formStepID || !(params.formStepID in formPages)) {
    return redirect(`/vorabCheck/${initialStepID}`);
  }
  const config = await getPageConfig(request, { dontThrow: true });
  const session = await getSession(request.headers.get("Cookie"));
  return json({ context: session.data, ...config });
};

export const action: ActionFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const stepID = params.formStepID as AllowedIDs;
  const currentStep = formPages[stepID];

  if (isStepComponentWithSchema(currentStep)) {
    const data = await allValidators[stepID].validate(formData);
    if (data.error) return validationError(data.error);
    session.set(stepID, data.data);
  }

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

  const headers = {
    "Set-Cookie": await commitSession(session),
  };

  return redirect(`/vorabCheck/${destinationString}`, { headers });
};

export default function Index() {
  const { context, content } = useLoaderData<typeof loader>();
  const params = useParams();
  const stepID = params.formStepID as AllowedIDs;
  const currentStep = formPages[stepID];
  const Component = currentStep.component;
  const pessimisticPath = progress[stepID] ?? 0;
  const pessimisticPathTotal = progress[initialStepID] ?? 0;
  const isLast = isLeaf(stepID, formGraph);

  return (
    <div>
      {content ? <PageContent content={content} /> : ""}
      <div>
        <ValidatedForm
          key={`${stepID}_form`}
          method="post"
          validator={allValidators[stepID]}
          defaultValues={context[stepID]}
        >
          <Component />
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
