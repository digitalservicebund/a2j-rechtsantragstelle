import type { FlowController } from "~/services/flow/server/buildFlowController";
import type { Translations } from "~/services/translations/getTranslationByKey";
import {
  createStepToSectionMapping,
  getSectionFromStepId,
  addFieldToGroup,
} from "./sectionMapping";
import {
  parseArrayField,
  createArrayFieldKey,
  createArrayBoxKey,
} from "./fieldParsingUtils";

// Sections to exclude from auto-generated summaries
const EXCLUDED_SECTIONS = new Set([
  "start",
  "abgabe",
  "zusammenfassung",
  "summary",
  "ergebnis",
  "result",
]);

export function groupFieldsByFlowNavigation(
  fields: string[],
  flowController: FlowController,
  fieldToStepMapping: Record<string, string>,
  translations?: Translations,
): {
  groups: Record<string, Record<string, string[]>>;
  sectionTitles: Record<string, string>;
} {
  // Get all the steps for the flow
  const stepStates = flowController.stepStates();

  const stepToSectionMapping = createStepToSectionMapping(stepStates);

  const groups: Record<string, Record<string, string[]>> = {};
  const sectionTitles: Record<string, string> = {};

  for (const field of fields) {
    let stepId = fieldToStepMapping[field];

    if (!stepId) {
      // Look for nested field patterns like "berufart.selbststaendig" -> "/finanzielle-angaben/einkommen/art"
      const nestedFieldMapping = Object.entries(fieldToStepMapping).find(
        ([mappedField]) => mappedField.startsWith(`${field}.`),
      );

      if (nestedFieldMapping) {
        stepId = nestedFieldMapping[1];
        fieldToStepMapping[field] = stepId;
      }
    }

    // Handle array fields like "kinder[0]" -> look for "kinder#" mappings
    const fieldInfo = parseArrayField(field);
    if (!stepId && fieldInfo.isArrayField && !fieldInfo.isArraySubField) {
      const arrayFieldMapping = Object.entries(fieldToStepMapping).find(
        ([mappedField]) =>
          mappedField.includes("#") &&
          mappedField.startsWith(`${fieldInfo.baseFieldName}#`),
      );

      if (arrayFieldMapping) {
        stepId = arrayFieldMapping[1];
        fieldToStepMapping[field] = stepId;
      }
    }

    // Handle array sub-fields like "bankkonten[0].kontoEigentuemer" or "kinder[0].vorname" -> look for "bankkonten#kontoEigentuemer" mappings
    if (!stepId && fieldInfo.isArraySubField) {
      const arrayFieldKey = createArrayFieldKey(field);
      stepId = fieldToStepMapping[arrayFieldKey];
      if (stepId) {
        fieldToStepMapping[field] = stepId;
      }
    }

    if (!stepId) {
      // Field not found in any step, put it in "other" section
      addFieldToGroup(groups, "other", "zusaetzliche_angaben", field);
      continue;
    }

    // Get the top-level section for this step
    const sectionInfo = getSectionFromStepId(stepId, stepToSectionMapping);
    const sectionKey = sectionInfo.sectionKey.replace(/^\//, "");

    if (EXCLUDED_SECTIONS.has(sectionKey)) {
      continue;
    }

    // Collect the section title from flow controller using translations like navigation does
    if (sectionInfo.sectionTitle && !sectionTitles[sectionKey]) {
      sectionTitles[sectionKey] =
        translations?.[sectionInfo.sectionTitle] ?? sectionInfo.sectionTitle;
    }

    // Special grouping for array fields - group by base field and index
    const arrayBoxKey = createArrayBoxKey(field);
    const boxKey = arrayBoxKey ?? sectionInfo.boxKey ?? "default";

    addFieldToGroup(groups, sectionKey, boxKey, field);
  }

  return { groups, sectionTitles };
}
