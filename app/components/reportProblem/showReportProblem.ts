import { type FlowId } from "~/domains/flowIds";

export function shouldShowReportProblem(
  flowId: FlowId,
  stepId: string,
): boolean {
  return (
    flowId === "/beratungshilfe/vorabcheck" ||
    flowId === "/fluggastrechte/formular" ||
    (flowId === "/kontopfaendung/wegweiser" && stepId !== "/start") ||
    (flowId === "/prozesskostenhilfe/formular" && stepId !== "/start/start") ||
    (flowId === "/beratungshilfe/antrag" && stepId !== "/start/start")
  );
}
