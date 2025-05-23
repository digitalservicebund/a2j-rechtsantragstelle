import set from "lodash/set";
import type { UserData } from "~/domains/userData";
import { resolveArrayCharacter } from "./resolveArrayCharacter";

export const resolveArraysFromKeys = (
  data: UserData,
  arrayIndexes: number[] = [],
) => {
  const resolvedObject: UserData = {};
  Object.entries(data).forEach(([key, value]) =>
    set(resolvedObject, resolveArrayCharacter(key, arrayIndexes), value),
  );
  return resolvedObject;
};
