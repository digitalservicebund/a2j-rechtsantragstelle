import { type FlowId } from "~/domains/flowIds";

export function shouldShowReportProblem(flowId: FlowId): boolean {
  return (
    flowId === "/beratungshilfe/vorabcheck" ||
    flowId === "/kontopfaendung/wegweiser" ||
    flowId === "/prozesskostenhilfe/formular" ||
    flowId === "/beratungshilfe/antrag"
  );
}
