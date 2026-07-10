import { type PagesConfig } from "~/domains/pageSchemas";

// TODO - Remove this function later after migrate all the flows
export const addLeadingSlashToPageSchemas = <T extends PagesConfig>(
  pageConfig: T,
): {
  [K in keyof T]: Omit<T[K], "stepId"> & {
    stepId: string;
  };
} =>
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
  ) as {
    [K in keyof T]: Omit<T[K], "stepId"> & {
      stepId: string;
    };
  };
