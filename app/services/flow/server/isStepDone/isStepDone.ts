import z from "zod";
import type { FlowId } from "~/domains/flowIds";
import {
  type PageConfig,
  pages,
  type PagesConfig,
  type UserDataFromPagesSchema,
} from "~/domains/pageSchemas";
import type { SchemaObject } from "~/domains/userData";
import { type ArrayConfigServer } from "~/services/array";
import partition from "lodash/partition";
import { findArraysWithCommonCondition } from "~/util/array";

export type ArrayConfigurations = Record<string, ArrayConfigServer>;

const filterPageSchemas =
  <T extends PagesConfig>(
    context: UserDataFromPagesSchema<T>,
    reachableSteps: string[],
    arrayConfigurations?: ArrayConfigurations,
  ) =>
  (config: PageConfig) => {
    if ("arrayPages" in config) {
      const matchingArrayConfig = Object.values(arrayConfigurations ?? {}).find(
        (arrayConfig) => arrayConfig.url.endsWith(config.stepId),
      );
      const statementKey =
        matchingArrayConfig?.statementKey as keyof typeof context;
      // eslint-disable-next-line sonarjs/different-types-comparison
      return context[statementKey] === "yes";
    }
    return (
      "pageSchema" in config && reachableSteps?.includes(`/${config.stepId}`)
    );
  };

/**
 * Multiple arrays on the same page, need to check if any of them share the same statementKey/conditional relevance
 */
function handlePageWithMultipleArrays(
  relevantPageSchemas: SchemaObject,
  context: UserDataFromPagesSchema<PagesConfig>,
  arrayConfigurations?: ArrayConfigurations,
) {
  const arraysWithCommonCondition = findArraysWithCommonCondition(
    Object.entries(arrayConfigurations ?? {}).filter(
      ([arrayName]) => arrayName in relevantPageSchemas,
    ),
  );
  if (arraysWithCommonCondition.length > 1) {
    const [arrayORSchemas, otherPageSchemas] = partition(
      Object.entries(relevantPageSchemas),
      ([schemaName]) => arraysWithCommonCondition.includes(schemaName),
    ).map((entries) => Object.fromEntries(entries) as SchemaObject);
    return z
      .intersection(
        z.object(otherPageSchemas),
        z.union(
          Object.entries(arrayORSchemas).map(([arrayName, arraySchema]) => {
            return z.object({ [arrayName]: arraySchema });
          }),
        ),
      )
      .safeParse(context).success;
  }
  return z.object(relevantPageSchemas).safeParse(context).success;
}

export const isStepDone = <T extends PagesConfig>(
  pageSchema: T,
  context: UserDataFromPagesSchema<T>,
  reachableSteps: string[],
  arrayConfigurations?: ArrayConfigurations,
) => {
  // Retrieve only the pageSchemas that are reachable, unless we're on an array page
  const relevantPageSchemas = Object.values(pageSchema)
    .filter(filterPageSchemas(context, reachableSteps, arrayConfigurations))
    .reduce<SchemaObject>((acc, v) => ({ ...acc, ...v.pageSchema }), {});
  if (Object.keys(relevantPageSchemas).length === 0) return true;
  if (
    Object.values(relevantPageSchemas).filter(
      (schema) => schema.type === "array",
    ).length > 1
  ) {
    return handlePageWithMultipleArrays(
      relevantPageSchemas,
      context,
      arrayConfigurations,
    );
  }
  return z.object(relevantPageSchemas).safeParse(context).success;
};

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
