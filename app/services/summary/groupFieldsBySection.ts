import type {
  FlowController,
  StepState,
} from "~/services/flow/server/buildFlowController";
import type { Translations } from "~/services/translations/getTranslationByKey";

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
  // Get the step hierarchy from flow controller
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

    const boxKey = sectionInfo.boxKey ?? "default";
    addFieldToGroup(groups, sectionKey, boxKey, field);
  }

  return { groups, sectionTitles };
}

function createStepToSectionMapping(
  stepStates: StepState[],
): Record<string, { sectionKey: string; sectionTitle: string }> {
  const mapping: Record<string, { sectionKey: string; sectionTitle: string }> =
    {};

  function processStepState(stepState: StepState, parentSectionKey?: string) {
    // If this step has sub-states, it's likely a section header
    if (stepState.subStates && stepState.subStates.length > 0) {
      const sectionKey = stepState.stepId;

      // Map all sub-steps to this section
      for (const subState of stepState.subStates) {
        processStepState(subState, sectionKey);
      }
    } else {
      // This is a leaf step - map it to the parent section
      const sectionKey = parentSectionKey ?? stepState.stepId;
      mapping[stepState.stepId] = {
        sectionKey,
        sectionTitle: parentSectionKey ?? stepState.stepId,
      };
    }
  }

  for (const stepState of stepStates) {
    processStepState(stepState);
  }

  return mapping;
}

function getSectionFromStepId(
  stepId: string,
  stepToSectionMapping: Record<
    string,
    { sectionKey: string; sectionTitle: string }
  >,
): { sectionKey: string; sectionTitle?: string; boxKey?: string } {
  // First try exact match
  const sectionInfo = stepToSectionMapping[stepId];
  if (sectionInfo) {
    return {
      sectionKey: sectionInfo.sectionKey,
      sectionTitle: sectionInfo.sectionTitle,
      boxKey: extractBoxKeyFromStepId(stepId),
    };
  }

  // Try to find a parent section by matching step prefixes
  // For example: "/finanzielle-angaben/partner/partner-einkommen-summe" should match "/finanzielle-angaben"
  for (const [mappedStepId, mappedSectionInfo] of Object.entries(
    stepToSectionMapping,
  )) {
    if (stepId.startsWith(mappedStepId + "/")) {
      return {
        sectionKey: mappedSectionInfo.sectionKey,
        sectionTitle: mappedSectionInfo.sectionTitle,
        boxKey: extractBoxKeyFromStepId(stepId),
      };
    }
  }

  // Fallback: try to extract section from stepId path
  const pathParts = stepId.split("/").filter(Boolean);
  if (pathParts.length >= 2) {
    return {
      sectionKey: pathParts[0], // First part should be the main section
      boxKey: pathParts[1], // Second part should be the subsection
    };
  }

  return { sectionKey: "other" };
}

function extractBoxKeyFromStepId(stepId: string): string {
  const parts = stepId.split("/").filter(Boolean);
  return parts[parts.length - 1] || "default";
}

function addFieldToGroup(
  groups: Record<string, Record<string, string[]>>,
  sectionKey: string,
  boxKey: string,
  field: string,
) {
  if (!groups[sectionKey]) {
    groups[sectionKey] = {};
  }
  if (!groups[sectionKey][boxKey]) {
    groups[sectionKey][boxKey] = [];
  }
  groups[sectionKey][boxKey].push(field);
}
