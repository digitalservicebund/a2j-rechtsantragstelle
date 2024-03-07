import type { Context } from "~/models/flows/contexts";
import { fieldIsArray, toLodashFormat } from "~/util/arrayVariable";
import _ from "lodash";

export const updateData = (
  sessionData: Context,
  validatedData: Context,
  arrayIndexes?: number[],
) => {
  const validatedDataWithParsableArrayKeys = Object.fromEntries(
    Object.entries(validatedData).map(([key, value]) =>
      fieldIsArray(key)
        ? [toLodashFormat(key, arrayIndexes), value]
        : [key, value],
    ),
  );
  Object.entries(validatedDataWithParsableArrayKeys).forEach(([key, value]) =>
    _.set(sessionData, key, value),
  );
  return sessionData;
};
