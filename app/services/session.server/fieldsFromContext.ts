import pick from "lodash/pick";
import type { Context } from "~/domains/userData";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { pageDataSchema } from "~/services/flow/pageDataSchema";
import { arrayIsNonEmpty } from "~/util/array";

function flattenObjectWithArrayKeys(
  obj: Context,
  arrayPage: number,
  prefix = "",
): Record<string, Context> {
  const result: Record<string, Context> = {};

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
      result[newKey] = (value ?? {}) as Context;
    }
  }

  return result;
}

export const fieldsFromContext = (context: Context, fieldNames: string[]) => {
  const parsedPageData = pageDataSchema.safeParse(context?.pageData);
  const arrayIndexes = parsedPageData.success
    ? parsedPageData.data.arrayIndexes
    : [];

  const resolvedFieldNames = fieldNames.map((fieldName) =>
    resolveArrayCharacter(fieldName, arrayIndexes),
  );

  const object = pick(context, resolvedFieldNames);

  if (arrayIsNonEmpty(arrayIndexes)) {
    return flattenObjectWithArrayKeys(object, arrayIndexes[0]) as Context;
  }

  return object;
};
