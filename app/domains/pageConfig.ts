import type { z } from "zod";

// TODO: better specify PageSchema to specify enums, strings, ...
export type PageSchema = Record<string, z.ZodTypeAny>;
export type PageConfig = { pageSchema?: PageSchema };
export type PagesConfig = Record<string, PageConfig>;

// Get a flat list of all fieldnames of a PageConfig
export type FieldNames<T extends PagesConfig> = {
  [StepId in keyof T]: T[StepId]["pageSchema"] extends z.ZodTypeAny
    ? z.infer<T[StepId]["pageSchema"]>
    : never;
}[keyof T];

type _Combine<
  T,
  K extends PropertyKey = T extends unknown ? keyof T : never,
> = T extends unknown ? T & Partial<Record<Exclude<K, keyof T>, never>> : never;

type Combine<T> = { [K in keyof _Combine<T>]: _Combine<T>[K] };
export type UserDataType<T extends PagesConfig> = Combine<FieldNames<T>>;
