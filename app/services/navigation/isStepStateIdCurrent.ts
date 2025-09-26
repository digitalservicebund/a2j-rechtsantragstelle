export function isStepStateIdCurrent(stepStateId: string, stepId: string) {
  // subflows might start with the same name, need to check the following char
  return stepId.startsWith(stepStateId + "/") || stepId === stepStateId;
}
