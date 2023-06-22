import type { AnyZodObject, ZodEnum } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export type StepComponentProps = {
  content: StrapiFormComponent[];
  additionalContext?: Record<string, string>;
  defaultValues?: DefaultValues;
};

export type StepInterface = {
  schema?: AnyZodObject | ZodEnum;
  additionalContext?: string[];
  component?: any;
};

export type DefaultValues = Record<string, string>;
