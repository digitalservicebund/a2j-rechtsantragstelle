import type { z } from "zod";
import type { AllowedUserTypes } from "./userData";

export type SchemaObject = Record<string, z.ZodType<AllowedUserTypes>>;

export type MultiFieldsValidationBaseSchema<
  K extends SchemaObject = SchemaObject,
> = z.ZodObject<K>;

export type FunctionMultiFieldsValidation<
  T extends SchemaObject = SchemaObject,
> = (
  baseSchema: MultiFieldsValidationBaseSchema<T>,
) => z.ZodObject<SchemaObject>;

export type MultiFieldsStepIdValidation<T extends SchemaObject = SchemaObject> =
  Record<string, FunctionMultiFieldsValidation<T>>;
