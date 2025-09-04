export function shouldShowReportProblem(stepId: string): boolean {
  return !stepId.endsWith("/start");
}
