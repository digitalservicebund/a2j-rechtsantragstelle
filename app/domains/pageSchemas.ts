import mapValues from "lodash/mapValues";
import type { z } from "zod";
import { prozesskostenhilfeFormularPages } from "~/domains/prozesskostenhilfe/formular/pages";
import { beratungshilfeAntragPages } from "./beratungshilfe/formular/pages";
import { beratungshilfeVorabcheckPages } from "./beratungshilfe/vorabcheck/pages";
import { flowIdFromPathname, parsePathname, type FlowId } from "./flowIds";
import { kontopfaendungWegweiserPages } from "./kontopfaendung/wegweiser/pages";
import type { SchemaObject } from "./userData";

const pages: Partial<Record<FlowId, PagesConfig>> = {
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheckPages,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiserPages,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularPages,
  "/beratungshilfe/antrag": beratungshilfeAntragPages,
} as const;

export function getPageSchema(pathname: string) {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId || !(flowId in pages)) return undefined;

  const { stepId, arrayIndexes } = parsePathname(pathname);
  const stepIdWithoutLeadingSlash = stepId.slice(1);

  // Find the page config for this step
  const pageConfig = Object.values(pages[flowId] ?? {}).find(
    (page) => page.stepId === stepIdWithoutLeadingSlash,
  );

  if (arrayIndexes.length > 0) {
    // For array pages, we need to find the correct parent that contains arrayPages
    // and navigate through the nested structure
    // Get the path parts from the original pathname
    const pathAfterFlowId = pathname.replace(flowId, "");
    const stepPathParts = pathAfterFlowId
      .split("/")
      .filter(Boolean)
      .filter((part) => !/^\d+$/.test(part)); // Remove numeric parts (array indexes)

    // Find the specific page that contains the arrayPages configuration for this path
    const pagesConfig = pages[flowId] ?? {};

    // First, find the specific page that matches the current path
    const currentPageConfig = Object.values(pagesConfig).find((page) => {
      if (!("arrayPages" in page)) return false;

      // Check if this page's stepId matches the beginning of our path
      const pageStepId = page.stepId;
      const pathWithoutLeadingSlash = stepPathParts.join("/");

      // The page should be the one that contains the array we're looking for
      // We need to check if the path starts with this page's stepId
      return pathWithoutLeadingSlash.startsWith(pageStepId);
    });

    if (!currentPageConfig || !("arrayPages" in currentPageConfig))
      return undefined;
    // Try to find the array page schema by navigating through the path
    const arraySchema = arrayPageSchemaFromNestedArrayPages(
      currentPageConfig,
      stepPathParts,
    );
    return arraySchema;
  }

  if (!pageConfig?.pageSchema) return undefined;

  // For non-array pages, return the page schema as is
  return pageConfig.pageSchema;
}

function arrayPageSchemaFromNestedArrayPages(
  pageConfig: ArrayPage,
  stepPathParts: string[],
): SchemaObject | undefined {
  const finalPageConfig = stepPathParts.reduce<ArrayPage | undefined>(
    (currentPage, part, index) => {
      if (!currentPage?.arrayPages) return undefined;

      // If this is the last part, return the array page config
      if (index === stepPathParts.length - 1) {
        return currentPage.arrayPages[part];
      }

      // Navigate to the next level, handling page identifiers gracefully
      const arrayPageConfig = currentPage.arrayPages[part];

      // If no nested arrayPages, this might be a page identifier, try the next part
      if (!arrayPageConfig?.arrayPages) {
        return currentPage; // Keep current page to try next part
      }

      // Move to the nested level
      return arrayPageConfig;
    },
    pageConfig,
  );

  // Return the schema from the final result
  return finalPageConfig?.pageSchema;
}

export function xStateTargetsFromPagesConfig<T extends PagesConfig>(
  pageSchema: T,
) {
  return mapValues(pageSchema, (v) => ({
    absolute: "#" + v.stepId.replaceAll("/", "."),
    relative: v.stepId.split("/").pop()!,
  }));
}

export type PagesConfig = Record<string, PageConfig>;

type FlowPage = { stepId: string; pageSchema?: SchemaObject };
type ArrayPage = {
  pageSchema?: SchemaObject;
  arrayPages?: Record<string, ArrayPage>;
};
type ArrayParentPage = {
  stepId: string;
  pageSchema: SchemaObject;
  arrayPages: Record<string, ArrayPage>;
};

type PageConfig = FlowPage | ArrayParentPage;

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
