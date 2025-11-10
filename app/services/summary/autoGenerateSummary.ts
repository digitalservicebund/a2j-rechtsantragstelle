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
import { parseArrayField } from "./fieldParsingUtils";

function groupFieldsByArrayType(allFields: FieldItem[]): {
  arrayFieldsByBase: Record<string, Record<string, FieldItem[]>>;
  nonArrayFields: FieldItem[];
} {
  const arrayFieldsByBase: Record<string, Record<string, FieldItem[]>> = {};
  const nonArrayFields: FieldItem[] = [];

  for (const field of allFields) {
    if (
      field.isArrayItem &&
      field.arrayBaseField !== undefined &&
      field.arrayIndex !== undefined
    ) {
      const baseFieldName = field.arrayBaseField;
      const groupKey = `${baseFieldName}-${field.arrayIndex}`;

      if (!arrayFieldsByBase[baseFieldName]) {
        arrayFieldsByBase[baseFieldName] = {};
      }
      if (!arrayFieldsByBase[baseFieldName][groupKey]) {
        arrayFieldsByBase[baseFieldName][groupKey] = [];
      }
      arrayFieldsByBase[baseFieldName][groupKey].push(field);
    } else {
      nonArrayFields.push(field);
    }
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
  const arrayGroups: ArrayGroup[] = [];

  for (const [baseFieldName, itemGroups] of Object.entries(arrayFieldsByBase)) {
    const groupItems: FieldItem[] = [];

    for (const [, groupFields] of Object.entries(itemGroups)) {
      const groupItem = createArrayGroupItems(groupFields);
      if (groupItem) {
        groupItems.push(groupItem);
      }
    }

    if (groupItems.length > 0) {
      const arrayGroupTitle =
        translations?.[baseFieldName] ??
        baseFieldName.charAt(0).toUpperCase() + baseFieldName.slice(1);

      arrayGroups.push({
        id: baseFieldName,
        title: arrayGroupTitle,
        items: groupItems,
      });
    }
  }

  return arrayGroups;
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
    title:
      sectionTitles[sectionName] ?? translations?.[sectionName] ?? sectionName,
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
  const fieldToStepMapping = createFieldToStepMapping(formFieldsMap, flowId);

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

  // For field questions, we need ALL fields (including filtered nested ones) to get translation options
  const fieldsForQuestions = expandedFields;

  const fieldQuestions = await getFormQuestionsForFields(
    fieldsForQuestions,
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
      );

      // Check if these are array fields and add array metadata
      const processedFields = boxFields.map((field, index) => {
        const fieldName = fields[index];
        // Handle both "name[index]" and "name[index].subfield" patterns
        const fieldInfo = parseArrayField(fieldName || "");

        if (fieldInfo.isArrayField) {
          const { baseFieldName, arrayIndex } = fieldInfo;

          return {
            ...field,
            isArrayItem: true,
            arrayIndex,
            arrayBaseField: baseFieldName,
          };
        }

        return field;
      });

      allFields.push(...processedFields);
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
