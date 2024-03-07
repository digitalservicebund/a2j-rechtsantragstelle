import _ from "lodash";
import type { Context } from "~/models/flows/contexts";
import { interpolateArrayChar } from "./arrayVariable";

export const normalizeObject = (data: Context, arrayIndexes?: number[]) => {
  const dataNormalized = {};
  Object.entries(data).forEach(([key, value]) =>
    _.set(dataNormalized, interpolateArrayChar(key, arrayIndexes), value),
  );
  return dataNormalized;
};
