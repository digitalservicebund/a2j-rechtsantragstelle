import partition from "lodash/partition";
import type { FieldItem, ArrayGroup } from "./types";
import type { Translations } from "~/services/translations/getTranslationByKey";

export function groupFieldsByArrayType(allFields: FieldItem[]): {
  arrayFieldsByBase: Record<string, Record<string, FieldItem[]>>;
  nonArrayFields: FieldItem[];
} {
  const [arrayFields, nonArrayFields] = partition(
    allFields,
    (field) =>
      field.isArrayItem &&
      field.arrayBaseField !== undefined &&
      field.arrayIndex !== undefined,
  );

  const arrayFieldsByBase: Record<string, Record<string, FieldItem[]>> = {};

  for (const field of arrayFields) {
    const baseFieldName = field.arrayBaseField!;
    const groupKey = `${baseFieldName}-${field.arrayIndex}`;

    if (!arrayFieldsByBase[baseFieldName]) {
      arrayFieldsByBase[baseFieldName] = {};
    }
    if (!arrayFieldsByBase[baseFieldName][groupKey]) {
      arrayFieldsByBase[baseFieldName][groupKey] = [];
    }
    arrayFieldsByBase[baseFieldName][groupKey].push(field);
  }

  return { arrayFieldsByBase, nonArrayFields };
}

export function createArrayGroupItems(
  groupFields: FieldItem[],
): FieldItem | null {
  if (groupFields.length === 0) return null;

  const firstField = groupFields[0];
  return {
    id: crypto.randomUUID().split("-")[0],
    question: "", // Empty for array items
    answer: "", // Empty for array items
    editUrl: firstField.editUrl,
    multipleQuestions: groupFields.map((field) => ({
      id: crypto.randomUUID().split("-")[0],
      question: field.question,
      answer: field.answer,
    })),
  };
}

export function buildArrayGroups(
  arrayFieldsByBase: Record<string, Record<string, FieldItem[]>>,
  translations?: Translations,
): ArrayGroup[] {
  return Object.entries(arrayFieldsByBase)
    .map(([baseFieldName, itemGroups]) => {
      const groupItems = Object.values(itemGroups)
        .map(createArrayGroupItems)
        .filter((item): item is FieldItem => item !== null);

      if (groupItems.length === 0) return null;

      const arrayGroupTitle =
        translations?.[baseFieldName] ??
        baseFieldName.charAt(0).toUpperCase() + baseFieldName.slice(1);

      return {
        id: baseFieldName,
        title: arrayGroupTitle,
        items: groupItems,
      } as ArrayGroup;
    })
    .filter((group): group is ArrayGroup => group !== null);
}
