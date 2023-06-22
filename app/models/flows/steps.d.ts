import type { AnyZodObject } from "zod";
import type { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";

export type StepComponentProps = {
  content: StrapiFormComponent[];
  defaultValues?: DefaultValues;
};

export type StepInterface = {
  schema?: AnyZodObject;
  component?: any;
};

export type DefaultValues = Record<string, string>;
export type FormPages = Record<string, StepInterface>;
