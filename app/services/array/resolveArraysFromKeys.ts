import set from "lodash/set";
import type { Context } from "~/domains/contexts";
import { resolveArrayCharacter } from "./resolveArrayCharacter";

export const resolveArraysFromKeys = (
  data: Context,
  arrayIndexes: number[] = [],
) => {
  const resolvedObject: Context = {};
  Object.entries(data).forEach(([key, value]) =>
    set(resolvedObject, resolveArrayCharacter(key, arrayIndexes), value),
  );
  return resolvedObject;
};
