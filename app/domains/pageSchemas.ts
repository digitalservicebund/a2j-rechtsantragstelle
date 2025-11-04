import mapValues from "lodash/mapValues";
import type { z } from "zod";
import { prozesskostenhilfeFormularPages } from "~/domains/prozesskostenhilfe/formular/pages";
import { beratungshilfeAntragPages } from "./beratungshilfe/formular/pages";
import { beratungshilfeVorabcheckPages } from "./beratungshilfe/vorabcheck/pages";
import { flowIdFromPathname, parsePathname, type FlowId } from "./flowIds";
import { kontopfaendungWegweiserPages } from "./kontopfaendung/wegweiser/pages";
import type { SchemaObject } from "./userData";
import { geldEinklagenFormularPages } from "./geldEinklagen/formular/pages";
import { fluggastrechteVorabcheckPages } from "./fluggastrechte/vorabcheck/pages";
import { type FormFieldsMap } from "~/services/cms/fetchAllFormFields";

const pages: Partial<Record<FlowId, PagesConfig>> = {
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheckPages,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiserPages,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularPages,
  "/beratungshilfe/antrag": beratungshilfeAntragPages,
  "/geld-einklagen/formular": geldEinklagenFormularPages,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheckPages,
} as const;

export const getAllPageSchemaByFlowId = (flowId: FlowId) => {
  const pagesConfig = pages[flowId] ?? {};

  const schemaObjects = Object.values(pagesConfig)
    .filter(({ pageSchema }) => pageSchema !== undefined)
    .map(({ pageSchema }) => pageSchema!);

  return Object.assign({}, ...schemaObjects) as SchemaObject;
};

export const getAllFieldsFromFlowId = (flowId: FlowId): FormFieldsMap => {
  const pagesConfig = pages[flowId] ?? {};
  const fieldsMap: FormFieldsMap = {};

  for (const page of Object.values(pagesConfig)) {
    if (page.pageSchema && !isArrayParentPage(page)) {
      const stepId = `/${page.stepId}`;
      fieldsMap[stepId] = Object.keys(page.pageSchema);
    }

    if (isArrayParentPage(page)) {
      for (const [arrayPageKey, arrayPage] of Object.entries(page.arrayPages)) {
        if (
          !arrayPage.pageSchema ||
          Object.keys(arrayPage.pageSchema).length === 0
        ) {
          continue;
        }

        const stepId = `/${page.stepId}/${arrayPageKey}`;
        fieldsMap[stepId] = Object.keys(arrayPage.pageSchema);
      }
    }
  }

  return fieldsMap;
};

export function getPageSchema(pathname: string) {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId || !(flowId in pages)) return undefined;

  const { stepId, arrayIndexes } = parsePathname(pathname);
  const stepIdWithoutLeadingSlash = stepId.slice(1);
  const pagesConfig = pages[flowId] ?? {};

  if (arrayIndexes.length > 0) {
    // An index in the URL tells us we are on a page that belongs to an array
    // To return its pageSchema, we need to find the parent first, which should be one or two levels above
    const stepPathParts = stepIdWithoutLeadingSlash.split("/");

    // The arrayParentPage matches our array page and its stepId should match the beginning of the current stepId
    const parentPageConfig = Object.values(pagesConfig)
      .filter(isArrayParentPage)
      .find(({ stepId }) => stepIdWithoutLeadingSlash.startsWith(stepId));

    if (!parentPageConfig) return undefined;

    // Try to find the array page schema by navigating through the path
    return arrayPageSchemaFromNestedArrayPages(parentPageConfig, stepPathParts);
  }

  return Object.values(pagesConfig).find(
    (page) => page.stepId === stepIdWithoutLeadingSlash,
  )?.pageSchema;
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

const isArrayParentPage = (page: PageConfig): page is ArrayParentPage =>
  page && "arrayPages" in page;

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
