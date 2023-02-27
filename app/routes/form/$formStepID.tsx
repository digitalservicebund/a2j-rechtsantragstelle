import type { ActionFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { redirect } from "@remix-run/node";

import type { LoaderArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import type { AllowedIDs } from "./formDefinition";
import { formDefinition, initial } from "./formDefinition";

type ButtonAction = "back" | "next";

export const loader = async ({ params }: LoaderArgs) => {
  if (params.formStepID && params.formStepID in formDefinition) {
    return null;
  }
  return redirect(`/form/${initial}`);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const stepID = formData.get("stepID") as AllowedIDs;
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

interface ButtonNavigationProps {
  stepID: string;
  isFirst: boolean;
  isLast: boolean;
}

function ButtonNavigation({ isFirst, isLast, stepID }: ButtonNavigationProps) {
  return (
    <pre>
      <button
        type="submit"
        name="_action"
        value="back"
        form={stepID}
        disabled={isFirst}
      >
        {"Zurück"}
      </button>
      |
      <input type="hidden" name="stepID" value={stepID} />
      <button type="submit" name="_action" value="next" form={stepID}>
        {isLast ? "Abschicken" : "Nächste Seite"}
      </button>
    </pre>
  );
}

export default function Index() {
  const params = useParams();
  const currentStepID = params.formStepID as AllowedIDs;

  const currentStep = formDefinition[currentStepID];
  const Component = currentStep.step.component;
  return (
    <div>
      <h2>Multi-Step Form Index</h2>
      <div
        key={currentStepID}
        style={{ border: "1px solid black", margin: 10, padding: 10 }}
      >
        {}
        <ValidatedForm
          method="post"
          validator={
            currentStep.step.schema !== undefined
              ? withZod(currentStep.step.schema)
              : withZod(z.object({}))
          }
          id={currentStepID}
        >
          <Component id={currentStepID} />
          <ButtonNavigation
            stepID={currentStepID}
            isFirst={currentStep.back === null}
            isLast={currentStep.next === null}
          />
        </ValidatedForm>
      </div>
    </div>
  );
}
