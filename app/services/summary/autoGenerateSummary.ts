import type { UserData } from "~/domains/userData";
import type { StepState } from "~/services/flow/server/buildFlowController";
import type { FieldItem, SummaryItem } from "./types";
import type { Translations } from "~/services/translations/getTranslationByKey";
import {
  getFormQuestionsForFields,
  createFieldToStepMapping,
} from "./getFormQuestions";
import type { FlowId } from "~/domains/flowIds";
import { fetchAllFormFields } from "~/services/cms/fetchAllFormFields";
import { groupFieldsByFlowNavigation } from "./groupFieldsBySection";
import { getValidUserDataFields } from "./getValidUserData";
import { expandArrayFields } from "./arrayFieldProcessing";
import { processBoxFields } from "./fieldEntryCreation";
import { groupFieldsByArrayType, buildArrayGroups } from "./arrayGrouping";

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
  stepStates: StepState[],
  translations: Translations,
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
  const groupingResult = groupFieldsByFlowNavigation(
    filteredFields,
    stepStates,
    fieldToStepMapping,
    translations,
    flowId,
  );

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
