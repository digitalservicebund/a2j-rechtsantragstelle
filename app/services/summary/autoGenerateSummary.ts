import type { UserData } from "~/domains/userData";
import type { StepState } from "~/services/flow/server/buildFlowController";
import type { FieldItem, SummaryItem } from "./types";
import type { Translations } from "~/services/translations/getTranslationByKey";
import {
  addObjectSubFields,
  getFormQuestionsForFields,
  createFieldToStepMapping,
} from "./getFormQuestions";
import type { FlowId } from "~/domains/flowIds";
import { groupFieldsByFlowNavigation } from "./groupFieldsBySection";
import { getValidUserDataFields } from "./getValidUserData";
import { expandArrayFields } from "./arrayFieldProcessing";
import { processBoxFields } from "./fieldEntryCreation";
import { groupFieldsByArrayType, buildArrayGroups } from "./arrayGrouping";
import { getAllFieldsFromFlowId } from "~/domains/pageSchemas";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const isCheckboxGroup = (value: Record<string, unknown>) =>
  Object.values(value).every((entry) => entry === "on" || entry === "off");

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

  const formFieldsMap = addObjectSubFields(
    getAllFieldsFromFlowId(flowId),
    flowId,
  );
  const fieldToStepMapping = createFieldToStepMapping(formFieldsMap);

  // Expand array fields into individual items
  const expandedFields = expandArrayFields(
    userDataFields,
    userData,
    fieldToStepMapping,
  );

  const filteredFields = expandedFields.filter((field) => {
    const isNestedField = field.includes(".") && !field.includes("[");
    const value = userData[isNestedField ? field.split(".")[0] : field];
    if (!isPlainObject(value)) return true;

    // Checkbox groups render as one row on the parent field, any other
    // object renders one row per sub-field
    return isCheckboxGroup(value) ? !isNestedField : isNestedField;
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

  const stepOrder = new Map(
    stepStates.map((s, i) => [s.stepId.replace(/^\//, ""), i]),
  );

  return sections.toSorted(
    (a, b) =>
      (stepOrder.get(String(a.id)) ?? Infinity) -
      (stepOrder.get(String(b.id)) ?? Infinity),
  );
}
