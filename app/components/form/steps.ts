import type { FunctionComponent } from "react";
import type { ZodObject } from "zod";

export { AgeStep } from "./steps/age";
export { SuccessStep } from "./steps/success";
export { ErrorStep } from "./steps/error";
export { WelcomeStep } from "./steps/welcome";

export interface StepInterface {
  component: FunctionComponent<any>;
  schema?: ZodObject<any>;
}
