import type { z } from "zod";
import { prozesskostenhilfeFormularPages } from "~/domains/prozesskostenhilfe/formular/pages";
import { beratungshilfeVorabcheckPages } from "./beratungshilfe/vorabcheck/pages";
import { flowIdFromPathname, parsePathname, type FlowId } from "./flowIds";
import { kontopfaendungWegweiserPages } from "./kontopfaendung/wegweiser/pages";
import type { SchemaObject } from "./types";

const pages: Partial<Record<FlowId, PagesConfig>> = {
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheckPages,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiserPages,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularPages,
} as const;

export function getPageSchema(pathname: string) {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId || !(flowId in pages)) return undefined;
  const { stepId } = parsePathname(pathname);
  const stepIdWithoutLeadingSlash = stepId.slice(1);
  return Object.values(pages[flowId] ?? {}).find(
    (page) => page.stepId === stepIdWithoutLeadingSlash,
  )?.pageSchema;
}

// TODO: better specify PageSchema to specify enums, strings, ...
export type PageSchema = SchemaObject;
export type PageConfig = { pageSchema?: PageSchema; stepId: string };
export type PagesConfig = Record<string, PageConfig>;

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
