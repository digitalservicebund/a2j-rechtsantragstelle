import type { AnyZodObject } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export type StepComponentProps = {
  content: StrapiFormComponent[];
  additionalContext?: Record<string, string>;
  defaultValues?: DefaultValues;
};

interface StepComponentWithSchema {
  schema: AnyZodObject;
  additionalContext?: string[];
}

export type DefaultValues = Record<string, string>;

export type StepInterface = StepComponentWithSchema | {};
