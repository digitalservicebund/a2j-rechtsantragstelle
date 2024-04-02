import _ from "lodash";
import type { Context } from "~/models/flows/contexts";

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
  return _.zipObject(fieldnames, _.at(context, resolvedFieldnames));
};
