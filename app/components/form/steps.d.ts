import type { FunctionComponent } from "react";
import type { AnyZodObject } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export type StepComponentProps = {
  content: StrapiFormComponent[];
  additionalContext?: Record<string, string>;
  defaultValues?: DefaultValues;
};

export type FormComponent = FunctionComponent<StepComponentProps>;

interface StepComponent {
  component: FormComponent;
}
interface StepComponentWithSchema {
  component: FormComponent;
  schema: AnyZodObject;
  additionalContext?: string[];
}

export type DefaultValues = Record<string, string>;

export type StepInterface = StepComponent | StepComponentWithSchema;
