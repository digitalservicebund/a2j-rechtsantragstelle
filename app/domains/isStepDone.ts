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

type ArrayConfigurations = Record<string, ArrayConfigServer>;

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

function findArraysWithCommonCondition(
  relevantPageSchemas: SchemaObject,
  arrayConfigurations?: ArrayConfigurations,
): string[] {
  const uniqueStatementKeys = new Set();
  const duplicateStatementKeys = new Set();
  return Object.entries(arrayConfigurations ?? {})
    .filter(([arrayName]) => arrayName in relevantPageSchemas)
    .map(([arrayName, arrayConfig]) => {
      const { statementKey } = arrayConfig;
      if (uniqueStatementKeys.has(statementKey)) {
        duplicateStatementKeys.add(statementKey);
      } else {
        uniqueStatementKeys.add(statementKey);
      }
      return [arrayName, arrayConfig] as const;
    })
    .filter(([, config]) => duplicateStatementKeys.has(config.statementKey))
    .map(([arrayName]) => arrayName);
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
    // Multiple arrays on the same page, need to check if any of them share the same statementKey/conditional relevance
    const arraysWithCommonCondition = findArraysWithCommonCondition(
      relevantPageSchemas,
      arrayConfigurations,
    );
    if (arraysWithCommonCondition.length > 1) {
      const [arrayORSchemas, otherPageSchemas] = partition(
        Object.entries(relevantPageSchemas),
        ([schemaName]) => arraysWithCommonCondition.includes(schemaName),
      ).map((entries) => Object.fromEntries(entries) as SchemaObject);
      const orSchema = z.union(
        Object.entries(arrayORSchemas).map(([arrayName, arraySchema]) => {
          return z.object({ [arrayName]: arraySchema });
        }),
      );
      return (
        z.object(otherPageSchemas).safeParse(context).success &&
        orSchema.safeParse(context).success
      );
    }
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
