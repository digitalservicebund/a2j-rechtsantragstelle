import _ from "lodash";
import type { Context } from "~/models/flows/contexts";

import { resolveArrayCharacter } from "~/util/arrayVariable";

export const fieldsFromContext = (
  context: Context,
  fieldnames: string[],
  arrayIndexes?: number[],
) => {
  const resolvedFieldnames = fieldnames.map((fieldname) =>
    resolveArrayCharacter(fieldname, arrayIndexes),
  );
  return _.zipObject(fieldnames, _.at(context, resolvedFieldnames));
};
