import type { z } from "zod";

export type SchemaObject = Record<string, z.ZodType>;

export type MultiFieldsValidationBaseSchema<
  K extends SchemaObject = SchemaObject,
> = z.ZodObject<K>;

export type FunctionMultiFieldsValidation<
  T extends SchemaObject = SchemaObject,
> = (baseSchema: MultiFieldsValidationBaseSchema<T>) => z.ZodType;

export type MultiFieldsStepIdValidation<T extends SchemaObject = SchemaObject> =
  Record<string, FunctionMultiFieldsValidation<T>>;
