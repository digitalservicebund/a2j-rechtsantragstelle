import type { StepInterface } from "./StepInterface";
import type { Validator } from "remix-validated-form";

import { Step as AgeStep } from "./steps/age";
import { Step as WelcomeStep } from "./steps/welcome";

export const _formDefinition = {
  welcome: {
    step: WelcomeStep,
    next: "age1",
  },
  age1: {
    step: AgeStep,
    next: "age2",
  },
  age2: {
    step: AgeStep,
    next: null,
  },
};
export type AllowedIDs = keyof typeof _formDefinition;
export type NullableIDs = AllowedIDs | null;
export const initial: AllowedIDs = "welcome";

interface StepDefinition {
  step: StepInterface;
  validator?: Validator<any>;
  next: NullableIDs;
}
type FormDefinition = Record<AllowedIDs, StepDefinition>;
export const formDefinition = _formDefinition as FormDefinition;
