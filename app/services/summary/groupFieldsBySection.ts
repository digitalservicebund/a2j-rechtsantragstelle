import type { FlowController } from "~/services/flow/server/buildFlowController";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { createArrayBoxKey } from "./fieldParsingUtils";
import { findStepIdForField } from "./getFormQuestions";

const EXCLUDED_SECTIONS = new Set([
  "start",
  "abgabe",
  "zusammenfassung",
  "summary",
  "ergebnis",
  "result",
]);

function extractBoxKeyFromPath(stepId: string): string {
  const segments = stepId.split("/").filter(Boolean);
  return segments.at(-1) ?? "default";
}

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
  const stepStates = flowController.stepStates();
  const validSections = new Set(
    stepStates.map((state) => state.stepId.replace(/^\//, "")),
  );

  const groups: Record<string, Record<string, string[]>> = {};
  const sectionTitles: Record<string, string> = {};

  for (const field of fields) {
    const stepId = findStepIdForField(field, fieldToStepMapping);

    if (!stepId) {
      continue;
    }

    // Remove flow prefix and get first segment
    let normalizedStepId = stepId;
    if (flowId && stepId.startsWith(flowId)) {
      normalizedStepId = stepId.substring(flowId.length);
    }

    const sectionKey = normalizedStepId.replace(/^\//, "").split("/")[0];

    if (EXCLUDED_SECTIONS.has(sectionKey) || !validSections.has(sectionKey)) {
      continue;
    }

    // Set section title using translation. Translations has a slash in them
    if (!sectionTitles[sectionKey]) {
      sectionTitles[sectionKey] =
        translations?.[`/${sectionKey}`] ?? sectionKey;
    }

    // Group by array key or extract box key from step path
    const boxKey = createArrayBoxKey(field) ?? extractBoxKeyFromPath(stepId);

    // Add field to group
    if (!groups[sectionKey]) groups[sectionKey] = {};
    if (!groups[sectionKey][boxKey]) groups[sectionKey][boxKey] = [];
    groups[sectionKey][boxKey].push(field);
  }

  return { groups, sectionTitles };
}
