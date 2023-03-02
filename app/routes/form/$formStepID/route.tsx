import { useLoaderData, useParams } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import type { AllowedIDs } from "../formDefinition";
import { formDefinition, initial, allValidators } from "../formDefinition";
import { ButtonNavigation } from "~/components/ButtonNavigation";
import { commitSession, getSession } from "~/sessions";

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.formStepID || !(params.formStepID in formDefinition)) {
    return redirect(`/form/${initial}`);
  }
  const session = await getSession(request.headers.get("Cookie"));
  const data = session.get(params.formStepID);
  return json({ data });
};

export const action: ActionFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const stepID = params.formStepID as AllowedIDs;
  const currentStep = formDefinition[stepID];

  if (currentStep.step.schema) {
    const data = await allValidators[stepID].validate(formData);
    if (data.error) return validationError(data.error);
    session.set(stepID, data.data);
  }

  const destination = currentStep.next;
  const destinationString = destination
    ? typeof destination === "string"
      ? destination
      : destination(formData)
    : initial;

  const headers = {
    "Set-Cookie": await commitSession(session),
  };

  return redirect(`/form/${destinationString}`, { headers });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const params = useParams();
  const stepID = params.formStepID as AllowedIDs;
  const currentStep = formDefinition[stepID];
  const Component = currentStep.step.component;
  return (
    <div>
      <h2>Multi-Step Form Index</h2>
      <div style={{ border: "1px solid black", margin: 10, padding: 10 }}>
        <ValidatedForm
          method="post"
          validator={allValidators[stepID]}
          defaultValues={data}
        >
          <Component />
          <ButtonNavigation
            backDestination={currentStep.back}
            isLast={currentStep.next === null}
          />
        </ValidatedForm>
      </div>
    </div>
  );
}
