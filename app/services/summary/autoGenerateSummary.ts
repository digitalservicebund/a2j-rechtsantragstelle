import type { UserData } from "~/domains/userData";
import type { FlowController } from "~/services/flow/server/buildFlowController";
import type { FieldItem, SummaryItem, ArrayGroup } from "./types";
import type { Translations } from "~/services/translations/getTranslationByKey";
import {
  getFormQuestionsForFields,
  createFieldToStepMapping,
} from "./getFormQuestions";
import type { FlowId } from "~/domains/flowIds";
import { fetchAllFormFields } from "~/services/cms/fetchAllFormFields";
import { groupFieldsByFlowNavigation } from "./groupFieldsBySection";
import { getValidUserDataFields } from "./fieldValidation";
import { expandArrayFields } from "./arrayFieldProcessing";
import { processBoxFields } from "./fieldEntryCreation";

function groupFieldsByArrayType(allFields: FieldItem[]): {
  arrayFieldsByBase: Record<string, Record<string, FieldItem[]>>;
  nonArrayFields: FieldItem[];
} {
  const arrayFields = allFields.filter(
    (field) =>
      field.isArrayItem &&
      field.arrayBaseField !== undefined &&
      field.arrayIndex !== undefined,
  );
  const nonArrayFields = allFields.filter(
    (field) =>
      !field.isArrayItem ||
      field.arrayBaseField === undefined ||
      field.arrayIndex === undefined,
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

function createArrayGroupItems(groupFields: FieldItem[]): FieldItem | null {
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

function buildArrayGroups(
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

function createSummarySection(
  sectionName: string,
  allFields: FieldItem[],
  sectionTitles: Record<string, string>,
  translations?: Translations,
): SummaryItem {
  const { arrayFieldsByBase, nonArrayFields } =
    groupFieldsByArrayType(allFields);
  const arrayGroups = buildArrayGroups(arrayFieldsByBase, translations);

  return {
    id: sectionName,
    title: sectionTitles[sectionName] ?? sectionName,
    fields: nonArrayFields,
    arrayGroups: arrayGroups.length > 0 ? arrayGroups : undefined,
  };
}

export async function generateSummaryFromUserData(
  userData: UserData,
  flowId: FlowId,
  flowController?: FlowController,
  translations?: Translations,
): Promise<SummaryItem[]> {
  const userDataFields = getValidUserDataFields(userData);

  if (userDataFields.length === 0) {
    return [];
  }

  const formFieldsMap = await fetchAllFormFields(flowId);
  const fieldToStepMapping = createFieldToStepMapping(formFieldsMap);

  // Expand array fields into individual items
  const expandedFields = expandArrayFields(
    userDataFields,
    userData,
    fieldToStepMapping,
  );

  const filteredFields = expandedFields.filter((field) => {
    if (field.includes(".") && !field.includes("[")) {
      const parentField = field.split(".")[0];
      // If parent exists and is a non-array object, don't render the nested field separately
      const parentValue = userData[parentField];
      if (
        parentValue &&
        typeof parentValue === "object" &&
        !Array.isArray(parentValue)
      ) {
        return false;
      }
    }
    return true;
  });

  const fieldQuestions = await getFormQuestionsForFields(
    filteredFields,
    fieldToStepMapping,
    flowId,
  );
  const groupingResult = flowController
    ? groupFieldsByFlowNavigation(
        filteredFields,
        flowController,
        fieldToStepMapping,
        translations,
        flowId,
      )
    : { groups: {}, sectionTitles: {} };

  const sections: SummaryItem[] = [];

  for (const [sectionName, boxes] of Object.entries(groupingResult.groups)) {
    const allFields: FieldItem[] = [];

    for (const [, fields] of Object.entries(boxes)) {
      const boxFields = processBoxFields(
        fields,
        userData,
        fieldQuestions,
        fieldToStepMapping,
        flowId,
      );

      allFields.push(...boxFields);
    }
    if (allFields.length === 0) {
      continue;
    }

    const section = createSummarySection(
      sectionName,
      allFields,
      groupingResult.sectionTitles,
      translations,
    );

    sections.push(section);
  }

  return sections;
}
