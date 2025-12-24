import type { z } from "zod";
import type { SchemaObject } from "./userData";

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

export type PagesConfig = Record<string, PageConfig>;

type FlowPage = { stepId: string; pageSchema?: SchemaObject };

export type ArrayPage = {
  pageSchema?: SchemaObject;
  arrayPages?: Record<string, ArrayPage>;
};

export type ArrayParentPage = {
  stepId: string;
  pageSchema: SchemaObject;
  arrayPages: Record<string, ArrayPage>;
};

export type PageConfig = FlowPage | ArrayParentPage;

type ExtractSchemas<T extends PagesConfig> = {
  [K in keyof T]: T[K]["pageSchema"] extends SchemaObject
    ? z.infer<z.ZodObject<T[K]["pageSchema"]>>
    : never;
}[keyof T];

type UnionToIntersection<U> = (
  U extends unknown ? (x: U) => void : never
) extends (x: infer R) => void
  ? R
  : never;

export type UserDataFromPagesSchema<T extends PagesConfig> = Partial<
  UnionToIntersection<ExtractSchemas<T>>
>;
