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
  flowId?: string,
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
    let stepId = findStepIdForField(field, fieldToStepMapping);

    if (!stepId) {
      // Field not found in any step, put it in "other" section
      addFieldToGroup(groups, "other", "zusaetzliche_angaben", field);
      continue;
    }

    // Strip flow path from stepId for section matching
    // stepId might be "/beratungshilfe/antrag/grundvoraussetzungen/..."
    // but we need "/grundvoraussetzungen/..." for section mapping
    if (flowId && stepId.startsWith(flowId)) {
      stepId = stepId.substring(flowId.length);
    }

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

    // Group Arrays by base field and index
    const arrayBoxKey = createArrayBoxKey(field);
    const boxKey = arrayBoxKey ?? sectionInfo.boxKey ?? "default";

    addFieldToGroup(groups, sectionKey, boxKey, field);
  }

  return { groups, sectionTitles };
}
