import type { AnyZodObject, ZodEnum } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export type StepComponentProps = {
  content: StrapiFormComponent[];
  defaultValues?: DefaultValues;
};

export type StepInterface = {
  schema?: AnyZodObject | ZodEnum;
  component?: any;
};

export type DefaultValues = Record<string, string>;
