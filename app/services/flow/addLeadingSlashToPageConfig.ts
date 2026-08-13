import { type PagesConfig } from "~/domains/pageSchemas";

// TODO - Remove this function later after migrate all the flows
// This function adds leading slashes to stepIds at runtime but preserves the original types
// for compileFlow to work correctly
export const addLeadingSlashToPageSchemas = <T extends PagesConfig>(
  pageConfig: T,
): T =>
  Object.fromEntries(
    Object.entries(pageConfig).map(([key, pageSchema]) => [
      key,
      {
        ...pageSchema,
        stepId: pageSchema.stepId.startsWith("/")
          ? pageSchema.stepId
          : `/${pageSchema.stepId}`,
      },
    ]),
  ) as T;
