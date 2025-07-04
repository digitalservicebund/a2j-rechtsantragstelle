import { type FlowId } from "~/domains/flowIds";

export function shouldShowReportProblem(
  flowId: FlowId,
  stepId: string,
): boolean {
  return (
    flowId === "/beratungshilfe/vorabcheck" ||
    flowId === "/fluggastrechte/formular" ||
    (stepId !== "/start" && stepId !== "/start/start")
  );
}
