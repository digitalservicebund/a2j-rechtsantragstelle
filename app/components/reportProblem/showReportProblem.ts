import { type FlowId } from "~/domains/flowIds";

export function shouldShowReportProblem(
  flowId: FlowId,
  pathname: string,
): boolean {
  return (
    flowId === "/beratungshilfe/vorabcheck" ||
    (flowId === "/kontopfaendung/wegweiser" &&
      pathname !== "/kontopfaendung/wegweiser/start") ||
    (flowId === "/prozesskostenhilfe/formular" &&
      pathname !== "/prozesskostenhilfe/formular/start/start") ||
    flowId === "/fluggastrechte/formular" ||
    (flowId === "/beratungshilfe/antrag" &&
      pathname !== "/beratungshilfe/antrag/start/start")
  );
}
