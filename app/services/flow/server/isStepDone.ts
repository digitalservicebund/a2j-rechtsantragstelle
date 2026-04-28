import z from "zod";
import {
  filterPageSchemasByReachableSteps,
  type PagesConfig,
  type UserDataFromPagesSchema,
} from "~/domains/pageSchemas";
import type { SchemaObject } from "~/domains/userData";
import { type ArrayConfigServer } from "~/services/array";

export type ArrayConfigurations = Record<string, ArrayConfigServer>;

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

  const hasEmptyRelevantPageSchemas =
    Object.keys(relevantPageSchemas).length === 0;

  return hasEmptyRelevantPageSchemas
    ? true
    : z.object(relevantPageSchemas).safeParse(userData).success;
};
