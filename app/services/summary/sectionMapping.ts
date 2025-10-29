import type { StepState } from "~/services/flow/server/buildFlowController";

export function createStepToSectionMapping(
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

export function getSectionFromStepId(
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

  // If no exact match, try to find a parent mapping by removing path segments
  const pathSegments = stepId.split("/").filter(Boolean);
  for (let i = pathSegments.length - 1; i >= 0; i--) {
    const partialPath = "/" + pathSegments.slice(0, i).join("/");
    const partialMatch = stepToSectionMapping[partialPath];
    if (partialMatch) {
      return {
        sectionKey: partialMatch.sectionKey,
        sectionTitle: partialMatch.sectionTitle,
        boxKey: extractBoxKeyFromStepId(stepId),
      };
    }
  }

  // Default fallback
  return {
    sectionKey: stepId.split("/")[1] || "other",
    sectionTitle: stepId.split("/")[1] || "Zusätzliche Angaben",
    boxKey: extractBoxKeyFromStepId(stepId),
  };
}

export function extractBoxKeyFromStepId(stepId: string): string {
  const segments = stepId.split("/").filter(Boolean);
  return segments[segments.length - 1] || "default";
}

export function addFieldToGroup(
  groups: Record<string, Record<string, string[]>>,
  sectionKey: string,
  boxKey: string,
  field: string,
): void {
  if (!groups[sectionKey]) {
    groups[sectionKey] = {};
  }

  if (!groups[sectionKey][boxKey]) {
    groups[sectionKey][boxKey] = [];
  }

  groups[sectionKey][boxKey].push(field);
}
