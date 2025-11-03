import z from "zod";
import type { FlowId } from "~/domains/flowIds";
import {
  pages,
  type PagesConfig,
  type UserDataFromPagesSchema,
} from "~/domains/pageSchemas";
import type { SchemaObject } from "~/domains/userData";
import type { ArrayConfigServer } from "~/services/array";

export const isStepDone = async <T extends PagesConfig>(
  pageSchema: T,
  context: UserDataFromPagesSchema<T>,
  reachableSteps: string[],
  arrayConfigurations?: Record<string, ArrayConfigServer>,
) => {
  // Retrieve only the pageSchemas that are reachable, unless we're on an array page
  const relevantPageSchemas = Object.values(pageSchema).filter((config) => {
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
  });
  if (relevantPageSchemas.length === 0) return false;
  const reducedPageSchemas = relevantPageSchemas.reduce<SchemaObject>(
    (acc, v) => ({ ...acc, ...v.pageSchema }),
    {},
  );
  return (await z.object(reducedPageSchemas).safeParseAsync(context)).success;
};

export function getRelevantPageSchemasForStepId(
  flowId: FlowId | undefined,
  stepId: string,
): PagesConfig {
  const flowPages = flowId ? pages[flowId] : {};
  const relevantPageSchemas = Object.fromEntries(
    Object.entries(flowPages ?? {}).filter(([, pageConfig]) =>
      pageConfig.stepId.startsWith(stepId.substring(1)),
    ),
  );
  return relevantPageSchemas;
}
