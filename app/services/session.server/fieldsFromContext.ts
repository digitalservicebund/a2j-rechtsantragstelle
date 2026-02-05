import pick from "lodash/pick";
import type { UserData } from "~/domains/userData";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";

function flattenObjectWithArrayKeys(
  obj: UserData,
  arrayPage: number[],
  prefix = "",
): Record<string, UserData> {
  const result: Record<string, UserData> = {};

  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}#${key}` : key;

    if (Array.isArray(value) && typeof value[arrayPage[0]] === "object") {
      // Flatten first object in array
      const flattenedChild = flattenObjectWithArrayKeys(
        value[arrayPage[0]],
        arrayPage.slice(1),
        newKey,
      );
      Object.assign(result, flattenedChild);
    } else {
      result[newKey] = (value ?? {}) as UserData;
    }
  }

  return result;
}

export const fieldsFromContext = (context: UserData, fieldNames: string[]) => {
  const parsedPageData = pageDataSchema.safeParse(context?.pageData);
  const arrayIndexes = parsedPageData.success
    ? parsedPageData.data.arrayIndexes
    : [];

  const resolvedFieldNames = fieldNames.map((fieldName) =>
    resolveArrayCharacter(fieldName, arrayIndexes),
  );

  const object = pick(context, resolvedFieldNames);

  if (arrayIsNonEmpty(arrayIndexes)) {
    return flattenObjectWithArrayKeys(object, arrayIndexes) as UserData;
  }

  return object;
};
