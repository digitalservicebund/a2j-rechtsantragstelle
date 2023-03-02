import type { StepInterface } from "~/components/form/steps";
import {
  WelcomeStep,
  AgeStep,
  ErrorStep,
  SuccessStep,
} from "~/components/form/steps";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";

// NOTE: This will get replaced by xstate machine definition
export const _formDefinition = {
  welcome: {
    step: WelcomeStep,
    next: "age",
    back: null,
  },
  age: {
    step: AgeStep,
    back: "welcome",
    next: (formData: FormData) => {
      return (formData.get("age") as number) > 18 ? "success" : "error";
    },
  },
  success: {
    back: "age",
    step: SuccessStep,
    next: null,
  },
  error: {
    back: "age",
    step: ErrorStep,
    next: null,
  },
};

export type AllowedIDs = keyof typeof _formDefinition;
export type NullableIDs = AllowedIDs | null;
export const initial: AllowedIDs = "welcome";
export type StepDecision = (context: FormData) => NullableIDs;

interface StepDefinition {
  step: StepInterface;
  next: NullableIDs | StepDecision;
  back: NullableIDs;
}
type FormDefinition = Record<AllowedIDs, StepDefinition>;
export const formDefinition = _formDefinition as FormDefinition;

export const allValidators = Object.fromEntries(
  Object.entries(formDefinition).map(([key, value]) => [
    key,
    value.step.schema ? withZod(value.step.schema) : withZod(z.object({})),
  ])
);
