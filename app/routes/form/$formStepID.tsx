import type { ActionFunction } from "@remix-run/node";
import { Form, useParams } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import type { FunctionComponent } from "react";
import { useState } from "react";
import type { FormStepProps } from "./FormStepProps";
import { Step as AgeStep } from "./steps/age";
import { Step as WelcomeStep } from "./steps/welcome";

import type { LoaderArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderArgs) => {
  if (params.formStepID === undefined) {
    redirect(`form/${initial}`);
  }
  return null;
};

const _formDefinition = {
  welcome: { step: WelcomeStep, next: "age1" },
  age1: { step: AgeStep, next: "age2" },
  age2: { step: AgeStep, next: null },
};

type AllowedIDs = keyof typeof _formDefinition;
type NullableIDs = AllowedIDs | null;

const initial: AllowedIDs = "welcome";

interface StepDefinition {
  step: FunctionComponent<FormStepProps>;
  next: NullableIDs;
}

type FormDefinition = Record<AllowedIDs, StepDefinition>;
const formDefinition = _formDefinition as FormDefinition;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action, nextTarget, previousTarget, ...values } =
    Object.fromEntries(formData);

  const targetURL = `/form/${_action === "next" ? nextTarget : previousTarget}`;
  return redirect(targetURL);
};

interface ButtonNavigationProps {
  prev: NullableIDs;
  next: NullableIDs;
  onClick: OnClick;
}

function ButtonNavigation({ prev, next, onClick }: ButtonNavigationProps) {
  return (
    <pre>
      <button
        type="submit"
        name="_action"
        value="back"
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
  const Step = formDefinition[currentStepID].step;
  return (
    <div>
      <h2>Multi-Step Form Index</h2>
      <div
        key={currentStepID}
        style={{ border: "1px solid black", margin: 10, padding: 10 }}
      >
        <Form method="post">
          <Step id={currentStepID} />
          <ButtonNavigation
            prev={previousStepTable[currentStepID]}
            next={formDefinition[currentStepID].next}
            onClick={onClick}
          />
        </Form>
      </div>
    </div>
  );
}
