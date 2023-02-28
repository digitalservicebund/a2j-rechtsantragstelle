import { useParams } from "@remix-run/react";
import { redirect } from "@remix-run/node";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import type { AllowedIDs } from "./formDefinition";
import { formDefinition, initial } from "./formDefinition";
import { ButtonNavigation } from "~/components/ButtonNavigation";

type ButtonAction = "back" | "next";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.formStepID || !(params.formStepID in formDefinition)) {
    return redirect(`/form/${initial}`);
  }
  return null;
};

export const action: ActionFunction = async ({ params, request }) => {
  // TODO: add server-side validation
  const formData = await request.formData();
  const stepID = params.formStepID as AllowedIDs;
  const buttonAction = formData.get("_action") as ButtonAction;
  const destination = formDefinition[stepID][buttonAction];

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
  const currentStep = formDefinition[params.formStepID as AllowedIDs];
  const Component = currentStep.step.component;
  return (
    <div>
      <h2>Multi-Step Form Index</h2>
      <div style={{ border: "1px solid black", margin: 10, padding: 10 }}>
        <ValidatedForm
          method="post"
          validator={
            currentStep.step.schema
              ? withZod(currentStep.step.schema)
              : withZod(z.object({}))
          }
        >
          <Component />
          <ButtonNavigation
            isFirst={currentStep.back === null}
            isLast={currentStep.next === null}
          />
        </ValidatedForm>
      </div>
    </div>
  );
}
