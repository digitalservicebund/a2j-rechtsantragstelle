import type { ActionFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useState } from "react";

import type { LoaderArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import type { NullableIDs, AllowedIDs } from "./formDefinition";
import { formDefinition, initial } from "./formDefinition";

export const loader = async ({ params }: LoaderArgs) => {
  // Reroute to initial step on unknown formStepID
  if (params.formStepID && params.formStepID in formDefinition) {
    return null;
  }
  return redirect(`/form/${initial}`);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, nextTarget, previousTarget, ...values } =
    Object.fromEntries(formData);

  const targetURL = `/form/${_action === "next" ? nextTarget : previousTarget}`;
  return redirect(targetURL);
};

interface ButtonNavigationProps {
  formID: string;
  prev: NullableIDs;
  next: NullableIDs;
  onClick: OnClick;
}

function ButtonNavigation({
  formID,
  prev,
  next,
  onClick,
}: ButtonNavigationProps) {
  return (
    <pre>
      <button
        type="submit"
        name="_action"
        value="back"
        form={formID}
        disabled={prev === null}
      >
        {"Zurück"}
      </button>
      |
      <input
        type="hidden"
        name="previousTarget"
        value={prev === null ? "disabled" : prev}
      />
      <input
        type="hidden"
        name="nextTarget"
        value={next === null ? "submit" : next}
      />
      <button
        type="submit"
        name="_action"
        value="next"
        form={formID}
        onClick={() => onClick(next)}
      >
        {next === null ? "Abschicken" : "Nächste Seite"}
      </button>
    </pre>
  );
}

interface OnClick {
  (nextStateId: AllowedIDs): void;
}

export default function Index() {
  const params = useParams();
  const currentStepID = params.formStepID as AllowedIDs;

  const [previousStepTable, setPreviousStepTable] = useState<
    Partial<Record<AllowedIDs, NullableIDs>>
  >({
    [initial]: null,
  });

  const onClick = (nextStateId: AllowedIDs) => {
    setPreviousStepTable({
      ...previousStepTable,
      [nextStateId]: currentStepID,
    });
  };

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
            formID={currentStepID}
            prev={previousStepTable[currentStepID]}
            next={currentStep.next}
            onClick={onClick}
          />
        </ValidatedForm>
      </div>
    </div>
  );
}
