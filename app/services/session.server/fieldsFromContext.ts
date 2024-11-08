import zipObject from "lodash/zipObject";
import at from "lodash/at";
import type { Context } from "~/domains/contexts";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { pageDataSchema } from "~/services/flow/pageDataSchema";

export const fieldsFromContext = (context: Context, fieldnames: string[]) => {
  const parsedPageData = pageDataSchema.safeParse(context?.pageData);
  const arrayIndexes = parsedPageData.success
    ? parsedPageData.data.arrayIndexes
    : [];

  const resolvedFieldnames = fieldnames.map((fieldname) =>
    resolveArrayCharacter(fieldname, arrayIndexes),
  );
  return zipObject(fieldnames, at(context, resolvedFieldnames));
};
