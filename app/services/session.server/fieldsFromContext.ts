import _ from "lodash";
import type { Context } from "~/models/flows/contexts";

import { interpolateArrayChar } from "~/util/arrayVariable";

export const fieldsFromContext = (
  context: Context,
  fieldnames: string[],
  arrayIndexes?: number[],
) => {
  const normalizedFieldnames = fieldnames.map((fieldname) =>
    interpolateArrayChar(fieldname, arrayIndexes),
  );
  return _.zipObject(fieldnames, _.at(context, normalizedFieldnames));
};
