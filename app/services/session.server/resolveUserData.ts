import get from "lodash/get";
import set from "lodash/set";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import type { UserData } from "~/domains/userData";
import type { PageData } from "../flow/pageDataSchema";

export const resolveUserData = (
  userData: UserData & { pageData?: PageData },
  fieldNames: string[],
) => {
  const arrayIndexes = userData.pageData?.arrayIndexes ?? [];
  const result: Record<string, any> = {};

  for (const fieldName of fieldNames) {
    const resolvedPath = resolveArrayCharacter(fieldName, arrayIndexes);
    const entry = get(userData, resolvedPath);
    if (entry !== undefined) set(result, fieldName, entry);
  }

  return result;
};
