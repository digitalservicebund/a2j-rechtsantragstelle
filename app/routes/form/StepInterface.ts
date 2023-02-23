import type { FunctionComponent } from "react";
import type { ZodObject } from "zod";

export interface StepInterface {
  component: FunctionComponent<any>;
  schema?: ZodObject<any>;
}
