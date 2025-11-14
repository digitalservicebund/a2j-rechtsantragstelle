import z from "zod";
import {
  filterPageSchemasByReachableSteps,
  type PagesConfig,
  type UserDataFromPagesSchema,
} from "~/domains/pageSchemas";
import type { SchemaObject } from "~/domains/userData";
import { type ArrayConfigServer } from "~/services/array";
import partition from "lodash/partition";
import { findArraysWithCommonCondition } from "~/services/array/findArraysWithCommonCondition";

export type ArrayConfigurations = Record<string, ArrayConfigServer>;

/**
 * Multiple arrays on the same page, need to check if any of them share the same statementKey/conditional relevance
 */
function handlePageWithMultipleArrays(
  relevantPageSchemas: SchemaObject,
  userData: UserDataFromPagesSchema<PagesConfig>,
  arrayConfigurations?: ArrayConfigurations,
) {
  const arraysWithCommonCondition = findArraysWithCommonCondition(
    Object.entries(arrayConfigurations ?? {}).filter(
      ([arrayName]) => arrayName in relevantPageSchemas,
    ),
  );
  if (arraysWithCommonCondition.length <= 1) {
    return z.object(relevantPageSchemas).safeParse(userData).success;
  }
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
    .safeParse(userData).success;
}

export const isStepDone = <T extends PagesConfig>(
  pageSchema: T,
  userData: UserDataFromPagesSchema<T>,
  reachableSteps: string[],
  arrayConfigurations?: ArrayConfigurations,
) => {
  // Retrieve only the pageSchemas that are reachable, unless we're on an array page
  const relevantPageSchemas = Object.values(pageSchema)
    .filter(
      filterPageSchemasByReachableSteps(
        userData,
        reachableSteps,
        arrayConfigurations,
      ),
    )
    .reduce<SchemaObject>((acc, v) => ({ ...acc, ...v.pageSchema }), {});
  if (Object.keys(relevantPageSchemas).length === 0) return true;
  const shouldHandlePageWithMultipleArrays =
    Object.values(relevantPageSchemas).filter(
      (schema) => schema.type === "array",
    ).length > 1;

  return shouldHandlePageWithMultipleArrays
    ? handlePageWithMultipleArrays(
        relevantPageSchemas,
        userData,
        arrayConfigurations,
      )
    : z.object(relevantPageSchemas).safeParse(userData).success;
};
