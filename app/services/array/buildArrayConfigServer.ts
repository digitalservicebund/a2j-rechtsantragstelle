import { type FlowId } from "~/domains/flowIds";
import type { ArrayConfigServer } from ".";
import { type FlowSession } from "../flow/newFlowEngine/createFlowSession";
import { type PageConfigMap } from "../flow/newFlowEngine/types";

export const buildArrayConfigServer = (
  flowSessionEngine: FlowSession<PageConfigMap>,
  flowId: FlowId,
): Record<string, ArrayConfigServer> | undefined => {
  const arrayInfo = flowSessionEngine.arrayInfo;

  if (arrayInfo === undefined) {
    return undefined;
  }

  const targetPath = arrayInfo.entryPoint?.split("/") ?? [];

  return {
    [arrayInfo.name]: {
      event: `add-${arrayInfo.name}` as const,
      url: flowId + targetPath.slice(0, -1).join("/"),
      initialInputUrl: targetPath.at(-1) ?? "",
      statementKey: arrayInfo.statementKey,
      displayIndexOffset: arrayInfo.displayIndexOffset,
      hiddenFields: arrayInfo.hiddenFields,
    },
  } as Record<string, ArrayConfigServer>;
};
