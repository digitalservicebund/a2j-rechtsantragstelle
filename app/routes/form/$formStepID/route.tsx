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
  formGraph,
  formPages,
  pathFinder,
  finalStep,
} from "~/lib/vorabcheck";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { commitSession, getSession } from "~/sessions";
import { isStepComponentWithSchema } from "~/components/form/steps";
import { findPreviousStep, isLeaf } from "~/lib/treeCalculations";
import getPageConfig from "~/services/cms/getPageConfig";
import PageContent from "~/components/PageContent";

const totalLength = pathFinder.find(initialStepID, finalStep).length;

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: data.title },
];

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.formStepID || !(params.formStepID in formPages)) {
    return redirect(`/form/${initialStepID}`);
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

  const links = formGraph.getNode(stepID)?.links ?? [];
  for (const link of links) {
    // 2. For each potential link: check if theres a condition and whether its fullfilled
    if (link.fromId === stepID && (!link.data || link.data(session.data))) {
      destinationString = link.toId as AllowedIDs;
      break;
    }
  }

  const headers = {
    "Set-Cookie": await commitSession(session),
  };

  return redirect(`/form/${destinationString}`, { headers });
};

export default function Index() {
  const { context, content } = useLoaderData<typeof loader>();
  const params = useParams();
  const stepID = params.formStepID as AllowedIDs;
  const currentStep = formPages[stepID];
  const Component = currentStep.component;
  const currentDepth = pathFinder.find(stepID, initialStepID).length;

  return (
    <div>
      <h2>Multi-Step Form Index</h2>
      {content ? <PageContent content={content} /> : ""}
      <div style={{ border: "1px solid black", margin: 10, padding: 10 }}>
        <ValidatedForm
          key={`${stepID}_form`}
          method="post"
          validator={allValidators[stepID]}
          defaultValues={context[stepID]}
        >
          <Component />
          {totalLength &&
            currentDepth &&
            `Schritt ${currentDepth} / ${totalLength}`}
          <ButtonNavigation
            backDestination={findPreviousStep(stepID, formGraph, context)}
            isLast={isLeaf(stepID, formGraph)}
          />
        </ValidatedForm>
      </div>
    </div>
  );
}
