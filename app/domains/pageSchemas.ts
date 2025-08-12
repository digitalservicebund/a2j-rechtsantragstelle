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
    console.log("🔍 stepPathParts:", { stepPathParts });

    // Find the page that contains the arrayPages configuration
    // We need to search through all pages to find one that has arrayPages
    // and can handle this specific path
    const pagesConfig = pages[flowId] ?? {};

    for (const [pageKey, pageConfig] of Object.entries(pagesConfig)) {
      if (!pageConfig.arrayPages) continue;

      // Try to find the array page schema by navigating through the path
      const arraySchema = findArrayPageSchemaInPage(pageConfig, stepPathParts);
      if (arraySchema) {
        console.log("🔍 arraySchema:", { arraySchema });
        return arraySchema;
      }
    }
  }

  if (!pageConfig?.pageSchema) return undefined;

  // For non-array pages, return the page schema as is
  return pageConfig.pageSchema;
}

function findArrayPageSchemaInPage(
  pageConfig: PageConfig,
  stepPathParts: string[],
): SchemaObject | undefined {
  if (!pageConfig.arrayPages || stepPathParts.length === 0) return undefined;
  console.log("🔍 pageConfig:", { pageConfig });

  const finalPageConfig = stepPathParts.reduce<PageConfig | undefined>(
    (currentPage, part, index) => {
      console.log("🔍 currentPage:", {
        currentPage,
        part,
        index,
      });
      // If we don't have a current page or arrayPages, we can't continue
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
