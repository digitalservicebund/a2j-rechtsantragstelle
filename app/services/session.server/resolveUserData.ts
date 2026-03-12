import get from "lodash/get";
import pick from "lodash/pick";
import type { UserData } from "~/domains/userData";
import { collectArrayFieldsForStep } from "~/domains/pageSchemas";
import { resolveArrayField } from "~/services/array/resolveArrayField";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { fieldIsArray } from "~/services/array";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";

function flattenObjectWithArrayKeys(
  obj: UserData,
  arrayPage: number,
  prefix = "",
): Record<string, UserData> {
  const result: Record<string, UserData> = {};

  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}#${key}` : key;

    if (Array.isArray(value) && typeof value[arrayPage] === "object") {
      // Flatten first object in array
      const flattenedChild = flattenObjectWithArrayKeys(
        value[arrayPage],
        arrayPage,
        key,
      );
      Object.assign(result, flattenedChild);
    } else {
      result[newKey] = (value ?? {}) as UserData;
    }
  }

  return result;
}

/**
 * Resolves user data for array pages using the new arrayField approach.
 * Instead of using # in field names, it uses the arrayFields from the page tree
 * to build the full data path and extract the correct nested value.
 */
function resolveWithArrayField(
  userData: UserData,
  fieldNames: string[],
  arrayFields: string[],
  arrayIndexes: number[],
): UserData {
  const result: UserData = {};
  for (const fieldName of fieldNames) {
    const fullPath = resolveArrayField(fieldName, arrayFields, arrayIndexes);
    const value = get(userData, fullPath);
    if (value !== undefined) {
      result[fieldName] = value as UserData[string];
    }
  }
  return result;
}

export const resolveUserData = (
  userData: UserData,
  fieldNames: string[],
  pathname?: string,
) => {
  const parsedPageData = pageDataSchema.safeParse(userData?.pageData);
  const arrayIndexes = parsedPageData.data?.arrayIndexes ?? [];

  const hasHashFields = fieldNames.some(fieldIsArray);

  if (!arrayIsNonEmpty(arrayIndexes)) {
    if (hasHashFields) {
      // Legacy # fields without arrayIndexes is invalid
      const resolvedFieldNames = fieldNames.map((fieldName) =>
        resolveArrayCharacter(fieldName, arrayIndexes),
      );
      const object = pick(userData, resolvedFieldNames);
      return flattenObjectWithArrayKeys(object, arrayIndexes[0]) as UserData;
    }
    return pick(userData, fieldNames);
  }

  // New arrayField approach: if no field uses #, use arrayField resolution

  if (!hasHashFields && pathname) {
    const arrayFields = collectArrayFieldsForStep(pathname);
    if (arrayFields.length > 0) {
      return resolveWithArrayField(
        userData,
        fieldNames,
        arrayFields,
        arrayIndexes,
      );
    }
  }

  // Legacy # approach
  const resolvedFieldNames = fieldNames.map((fieldName) =>
    resolveArrayCharacter(fieldName, arrayIndexes),
  );

  const object = pick(userData, resolvedFieldNames);
  return flattenObjectWithArrayKeys(object, arrayIndexes[0]) as UserData;
};
