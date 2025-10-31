import type { FlowController } from "~/services/flow/server/buildFlowController";
import type { Translations } from "~/services/translations/getTranslationByKey";
import {
  createStepToSectionMapping,
  getSectionFromStepId,
  addFieldToGroup,
} from "./sectionMapping";
import { createArrayBoxKey } from "./fieldParsingUtils";
import { findStepIdForField } from "./getFormQuestions";

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
    // Use the existing field resolution logic from getFormQuestions
    const stepId = findStepIdForField(field, fieldToStepMapping);

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
