import { useParams } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import type { AllowedIDs } from "./formDefinition";
import { formDefinition, initial, allValidators } from "./formDefinition";
import { ButtonNavigation } from "~/components/ButtonNavigation";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.formStepID || !(params.formStepID in formDefinition)) {
    return redirect(`/form/${initial}`);
  }
  return null;
};

export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData();
  const stepID = params.formStepID as AllowedIDs;
  const currentStep = formDefinition[stepID];

  if (currentStep.step.schema) {
    // some steps don't have a schema and therefore don't need validation
    const data = await allValidators[stepID].validate(formData);
    if (data.error) return validationError(data.error);
  }

  const destination = currentStep.next;
  if (destination === null) {
    return redirect(`/form/${initial}`); // actually this is end of form
  } else if (typeof destination === "string") {
    return redirect(`/form/${destination}`);
  } else {
    return redirect(`/form/${destination(formData)}`);
  }
};

export default function Index() {
  const params = useParams();
  const stepID = params.formStepID as AllowedIDs;
  const currentStep = formDefinition[stepID];
  const Component = currentStep.step.component;
  return (
    <div>
      <h2>Multi-Step Form Index</h2>
      <div style={{ border: "1px solid black", margin: 10, padding: 10 }}>
        <ValidatedForm method="post" validator={allValidators[stepID]}>
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
