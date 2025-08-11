import mapValues from "lodash/mapValues";
import type { z } from "zod";
import { prozesskostenhilfeFormularPages } from "~/domains/prozesskostenhilfe/formular/pages";
import { beratungshilfeAntragPages } from "./beratungshilfe/formular/pages";
import { beratungshilfeVorabcheckPages } from "./beratungshilfe/vorabcheck/pages";
import {
  flowIdFromPathname,
  getParentStepId,
  parsePathname,
  type FlowId,
} from "./flowIds";
import { kontopfaendungWegweiserPages } from "./kontopfaendung/wegweiser/pages";
import type { SchemaObject } from "./userData";
import mapKeys from "lodash/mapKeys";

const pages: Partial<Record<FlowId, PagesConfig>> = {
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheckPages,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiserPages,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularPages,
  "/beratungshilfe/antrag": beratungshilfeAntragPages,
} as const;

export function getPageSchema(pathname: string) {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId || !(flowId in pages)) return undefined;
  console.log("🔍 getPageSchema:", { flowId });

  const { stepId, arrayIndexes } = parsePathname(pathname);
  const parentStepId = getParentStepId(pathname);
  console.log("🔍 getPageSchema:", { parentStepId, stepId, pages });
  const stepIdWithoutLeadingSlash = stepId.slice(1);
  const parentStepIdWithoutLeadingSlash = parentStepId.slice(1);

  // Find the page config for this step
  const pageConfig = Object.values(pages[flowId] ?? {}).find(
    (page) => page.stepId === stepIdWithoutLeadingSlash,
  );
  // Find the parent page config
  const parentPageConfig = Object.values(pages[flowId] ?? {}).find(
    (page) => page.stepId === parentStepIdWithoutLeadingSlash,
  );
  console.log("🔍 getPageSchema:", { parentPageConfig });

  console.log("🔍 getPageSchema:", { pageConfig });

  if (!pageConfig?.pageSchema) return undefined;

  if (parentPageConfig?.arrayPages) {
    const parentPageKey = stepIdWithoutLeadingSlash.split("/")[2];
    const arrayPageConfig = parentPageConfig.arrayPages[parentPageKey];
    const arraySchema = arrayPageConfig.pageSchema;
    console.log("🔍 getPageSchema:", { arraySchema, parentPageKey });
    return arraySchema;

    // Find the array field in the page schema
    // for (const [fieldName, fieldSchema] of Object.entries(
    //   pageConfig.pageSchema,
    // )) {
    //   if (fieldSchema.def?.type === "array") {
    //     // This is an array field, return the element schema for individual array items
    //     const arraySchema = fieldSchema as z.ZodArray<z.ZodObject>;
    //     const elementSchema = arraySchema.element.shape as SchemaObject;
    //     const pageSchema = mapKeys(
    //       elementSchema,
    //       (_, nestedFieldName) => `${fieldName}#${nestedFieldName}`,
    //     );
    //     console.log("🔍 getPageSchema:", { pageSchema });
    //     return pageSchema;
    //   }
    // }
  }

  // For non-array pages, return the page schema as is
  return pageConfig.pageSchema;
}

export function xStateTargetsFromPagesConfig<T extends PagesConfig>(
  pageSchema: T,
) {
  return mapValues(pageSchema, (v) => ({
    absolute: "#" + v.stepId.replaceAll("/", "."),
    relative: v.stepId.split("/").pop()!,
  }));
}

export type PageConfig = {
  pageSchema?: SchemaObject;
  stepId: string;
  arrayPages?: Record<string, PageConfig>;
};
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
