import { useLoaderData, useParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import type { AllowedIDs } from "~/lib/vorabcheck";
import {
  initialStepID,
  allValidators,
  formFlow,
  formPages,
  backTrace,
} from "~/lib/vorabcheck";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { commitSession, getSession } from "~/sessions";
import { isStepComponentWithSchema } from "~/components/form/steps";

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.formStepID || !(params.formStepID in formPages)) {
    return redirect(`/form/${initialStepID}`);
  }
  const session = await getSession(request.headers.get("Cookie"));
  return json({ stepData: session.get(params.formStepID) });
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

  if (formFlow[stepID] !== undefined) {
    const flowDestination = formFlow[stepID];
    // 2. A transition for the current step exists inside formFlow
    if (typeof flowDestination === "string") {
      // 3. If its a string -> jump there
      destinationString = flowDestination;
    } else if (Array.isArray(flowDestination)) {
      // 4. If its an array: find the first matching element
      // 4a. string or undefined condition are direct transitions, else pass cookie data to condition
      const arrayDestination = flowDestination.find(
        (element) =>
          typeof element === "string" ||
          element.condition === undefined ||
          element.condition(session.data)
      );
      // 4b. If not a string: pick .destination out of Transition
      destinationString =
        typeof arrayDestination === "string"
          ? arrayDestination
          : arrayDestination?.destination ?? initialStepID;
    }
  }

  const headers = {
    "Set-Cookie": await commitSession(session),
  };

  return redirect(`/form/${destinationString}`, { headers });
};

export default function Index() {
  const { stepData } = useLoaderData<typeof loader>();
  const params = useParams();
  const stepID = params.formStepID as AllowedIDs;
  const currentStep = formPages[stepID];
  const Component = currentStep.component;
  return (
    <div>
      <h2>Multi-Step Form Index</h2>
      <div style={{ border: "1px solid black", margin: 10, padding: 10 }}>
        <ValidatedForm
          key={`${stepID}_form`}
          method="post"
          validator={allValidators[stepID]}
          defaultValues={stepData}
        >
          <Component />
          <ButtonNavigation
            backDestination={backTrace[stepID]}
            isLast={!(stepID in formFlow)}
          />
        </ValidatedForm>
      </div>
    </div>
  );
}
