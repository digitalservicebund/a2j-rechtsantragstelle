import { type FlowId } from "~/domains/flowIds";

export function shouldShowReportProblem(
  flowId: FlowId,
  stepId: string,
): boolean {
  return (
    flowId === "/beratungshilfe/vorabcheck" ||
    (flowId === "/kontopfaendung/wegweiser" &&
      stepId !== "/kontopfaendung/wegweiser/start") ||
    (flowId === "/prozesskostenhilfe/formular" &&
      stepId !== "/prozesskostenhilfe/formular/start/start") ||
    flowId === "/fluggastrechte/formular" ||
    (flowId === "/beratungshilfe/antrag" &&
      stepId !== "/beratungshilfe/antrag/start/start")
  );
}
