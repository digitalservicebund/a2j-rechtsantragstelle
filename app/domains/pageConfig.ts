import type { z } from "zod";

// TODO: better specify PageSchema to specify enums, strings, ...
export type PageSchema = Record<string, z.ZodTypeAny>;
export type PageConfig = { pageSchema?: PageSchema; url: string };
export type PagesConfig = Record<string, PageConfig>;

type ExtractSchemas<T extends PagesConfig> = {
  [K in keyof T]: T[K]["pageSchema"] extends Record<string, z.ZodTypeAny>
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
