import type { StepInterface } from "./StepInterface";
import type { Validator } from "remix-validated-form";

import { Step as AgeStep } from "./steps/age";
import { Step as WelcomeStep } from "./steps/welcome";
import { Step as SuccessStep } from "./steps/success";
import { Step as ErrorStep } from "./steps/error";

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
  validator?: Validator<any>;
  next: NullableIDs | StepDecision;
  back: NullableIDs;
}
type FormDefinition = Record<AllowedIDs, StepDefinition>;
export const formDefinition = _formDefinition as FormDefinition;
