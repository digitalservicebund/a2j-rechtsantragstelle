import type { z } from "zod";

type SchemaObject = Record<string, z.ZodTypeAny>;

export type MultiFieldsValidationBaseSchema<
  K extends SchemaObject = SchemaObject,
> = z.ZodObject<K>;

export type FunctionMultiFieldsValidation<
  T extends SchemaObject = SchemaObject,
> = (baseSchema: MultiFieldsValidationBaseSchema<T>) => z.ZodTypeAny;

export type MultiFieldsStepIdValidation<T extends SchemaObject = SchemaObject> =
  Record<string, FunctionMultiFieldsValidation<T>>;
