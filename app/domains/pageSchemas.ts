import mapValues from "lodash/mapValues";
import { type z } from "zod";
import { prozesskostenhilfeFormularPages } from "~/domains/prozesskostenhilfe/formular/pages";
import { beratungshilfeAntragPages } from "./beratungshilfe/formular/pages";
import { beratungshilfeVorabcheckPages } from "./beratungshilfe/vorabcheck/pages";
import { flowIdFromPathname, parsePathname, type FlowId } from "./flowIds";
import { kontopfaendungWegweiserPages } from "./kontopfaendung/wegweiser/pages";
import type { SchemaObject } from "./userData";
import { geldEinklagenFormularPages } from "./geldEinklagen/formular/pages";
import { fluggastrechteFormularPages } from "./fluggastrechte/formular/pages";
import { fluggastrechteVorabcheckPages } from "./fluggastrechte/vorabcheck/pages";
import { type ArrayConfigurations } from "~/services/flow/server/isStepDone";
import { kontopfaendungPkontoAntragPages } from "./kontopfaendung/pkonto/antrag/pages";
import { erbscheinWegweiserPages } from "~/domains/erbschein/wegweiser/pages";
import { erbscheinNachlassgerichtPages } from "./erbschein/nachlassgericht/pages";

export const pages: Record<FlowId, PagesConfig> = {
  "/beratungshilfe/vorabcheck": beratungshilfeVorabcheckPages,
  "/kontopfaendung/wegweiser": kontopfaendungWegweiserPages,
  "/prozesskostenhilfe/formular": prozesskostenhilfeFormularPages,
  "/beratungshilfe/antrag": beratungshilfeAntragPages,
  "/geld-einklagen/formular": geldEinklagenFormularPages,
  "/fluggastrechte/formular": fluggastrechteFormularPages,
  "/fluggastrechte/vorabcheck": fluggastrechteVorabcheckPages,
  "/kontopfaendung/pkonto/antrag": kontopfaendungPkontoAntragPages,
  "/erbschein/wegweiser": erbscheinWegweiserPages,
  "/erbschein/nachlassgericht": erbscheinNachlassgerichtPages,
} as const;

export type FormFieldsMap = Record<string, string[]>;

export const getAllPageSchemaByFlowId = (flowId: FlowId) => {
  const pagesConfig = pages[flowId];

  const schemaObjects = Object.values(pagesConfig)
    .filter(({ pageSchema }) => pageSchema !== undefined)
    .map(({ pageSchema }) => pageSchema!);

  return Object.assign({}, ...schemaObjects) as SchemaObject;
};

function assignFieldsForSchema(
  fieldsMap: FormFieldsMap,
  stepId: string,
  schema: Record<string, z.ZodTypeAny> | undefined,
) {
  if (!schema || Object.keys(schema).length === 0) {
    return;
  }

  fieldsMap[stepId] = Object.keys(schema);
}

function assignArrayParentFields(
  fieldsMap: FormFieldsMap,
  page: ArrayParentPage,
) {
  assignFieldsForSchema(fieldsMap, `/${page.stepId}`, page.pageSchema);
  assignFieldsForSchema(fieldsMap, `/${page.stepId}`, page.arraySchema);

  assignNestedArrayPageFields(fieldsMap, page.arrayPages, page.stepId);
}

function assignNestedArrayPageFields(
  fieldsMap: FormFieldsMap,
  arrayPages: Record<string, ArrayPage>,
  parentStepId: string,
) {
  for (const [arrayPageKey, arrayPage] of Object.entries(arrayPages)) {
    const stepId = `/${parentStepId}/${arrayPageKey}`;
    assignFieldsForSchema(fieldsMap, stepId, arrayPage.pageSchema);

    assignFieldsForSchema(fieldsMap, stepId, arrayPage.arraySchema);

    if (arrayPage.arrayPages) {
      assignNestedArrayPageFields(
        fieldsMap,
        arrayPage.arrayPages,
        `${parentStepId}/${arrayPageKey}`,
      );
    }
  }
}

export const getAllFieldsFromFlowId = (flowId: FlowId): FormFieldsMap => {
  const pagesConfig = pages[flowId];
  const fieldsMap: FormFieldsMap = {};

  for (const page of Object.values(pagesConfig)) {
    if (isArrayParentPage(page)) {
      assignArrayParentFields(fieldsMap, page);
      continue;
    }

    assignFieldsForSchema(fieldsMap, `/${page.stepId}`, page.pageSchema);
  }

  return fieldsMap;
};

export function getPageSchema(pathname: string) {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId) return undefined;

  const { stepId, arrayIndexes } = parsePathname(pathname);
  const stepIdWithoutLeadingSlash = stepId.slice(1);
  const pagesConfig = pages[flowId];

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

  const page = Object.values(pagesConfig).find(
    (page) => page.stepId === stepIdWithoutLeadingSlash,
  );

  if (!page) return undefined;

  if (isArrayParentPage(page) && page.arraySchema) {
    return page.arraySchema as unknown as SchemaObject;
  }

  return page.pageSchema;
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
type ArraySchema = Record<string, z.ZodArray<z.ZodTypeAny>>;
export type ArrayPage = {
  pageSchema?: SchemaObject;
  arraySchema?: ArraySchema;
  arrayPages?: Record<string, ArrayPage>;
};
type ArrayParentPage = {
  stepId: string;
  pageSchema?: SchemaObject;
  arraySchema?: ArraySchema;
  arrayPages: Record<string, ArrayPage>;
};

const isArrayParentPage = (page: PageConfig): page is ArrayParentPage =>
  page && "arrayPages" in page;

export type PageConfig = FlowPage | ArrayParentPage;

/**
 * Walk the arrayPages tree from a leaf page and collect all arraySchema keys.
 * These, combined with URL array indexes, form the full data path to the leaf's fields.
 */
export function collectArrayFieldsForStep(pathname: string): string[] {
  const flowId = flowIdFromPathname(pathname);
  if (!flowId) return [];
  const { stepId, arrayIndexes } = parsePathname(pathname);
  if (arrayIndexes.length === 0) return [];

  const stepIdWithoutLeadingSlash = stepId.slice(1);
  const pagesConfig = pages[flowId];

  const parentPageConfig = Object.values(pagesConfig)
    .filter(isArrayParentPage)
    .find(({ stepId }) => stepIdWithoutLeadingSlash.startsWith(stepId));

  if (!parentPageConfig) return [];

  const arrayFields: string[] = parentPageConfig.arraySchema
    ? Object.keys(parentPageConfig.arraySchema)
    : [];

  const remainingPath = stepIdWithoutLeadingSlash
    .slice(parentPageConfig.stepId.length + 1)
    .split("/");

  let currentNode: ArrayPage | undefined = parentPageConfig;
  for (const part of remainingPath) {
    if (!currentNode?.arrayPages?.[part]) continue;
    currentNode = currentNode.arrayPages[part];
    if (currentNode.arraySchema) {
      arrayFields.push(...Object.keys(currentNode.arraySchema));
    }
  }

  return arrayFields;
}

type ExtractSchemas<T extends PagesConfig> = {
  [K in keyof T]: T[K] extends { pageSchema: SchemaObject }
    ? z.infer<z.ZodObject<T[K]["pageSchema"]>>
    : T[K] extends { arraySchema: infer A extends ArraySchema }
      ? { [AK in keyof A]: z.infer<A[AK]> }
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
export function getRelevantPageSchemasForStepId(
  flowId: FlowId,
  stepId: string,
): PagesConfig {
  return Object.fromEntries(
    Object.entries(pages[flowId] ?? {}).filter(([, pageConfig]) =>
      pageConfig.stepId.startsWith(stepId.substring(1)),
    ),
  );
}

export const filterPageSchemasByReachableSteps =
  <T extends PagesConfig>(
    userData: UserDataFromPagesSchema<T>,
    reachableSteps: string[],
    arrayConfigurations?: ArrayConfigurations,
  ) =>
  (config: PageConfig) => {
    if ("arrayPages" in config) {
      const matchingArrayConfig = Object.values(arrayConfigurations ?? {}).find(
        (arrayConfig) => arrayConfig.url.endsWith(config.stepId),
      );
      const statementKey =
        matchingArrayConfig?.statementKey as keyof typeof userData;
      return userData[statementKey] === "yes";
    }
    return (
      "pageSchema" in config && reachableSteps?.includes(`/${config.stepId}`)
    );
  };
