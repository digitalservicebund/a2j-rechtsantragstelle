import { type FlowId } from "~/domains/flowIds";
import type { ArrayConfigServer } from ".";
import { type FlowSession } from "../flow/newFlowEngine/createFlowSession";
import { type PageConfigMap } from "../flow/newFlowEngine/types";
import { ARRAY_WILDCARD } from "~/services/flow/newFlowEngine/compileFlow";

export const buildArrayConfigServer = (
  flowSessionEngine: FlowSession<PageConfigMap>,
  flowId: FlowId,
): Record<string, ArrayConfigServer> | undefined => {
  const arrayInfo = flowSessionEngine.arrayInfo;

  if (arrayInfo === undefined) {
    return undefined;
  }

  // The array's base URL is nextArrayPath (the item stepId) up to the first
  // wildcard, e.g. ".../geldanlagen/geldanlage/#/art" gives
  // ".../geldanlagen/geldanlage".
  const targetPath = flowSessionEngine.nextArrayPath
    ?.split(`/${ARRAY_WILDCARD}`)
    .at(0);

  return {
    [arrayInfo.name]: {
      event: `add-${arrayInfo.name}` as const,
      url: flowId + targetPath,
      initialInputUrl: arrayInfo.entryPoint,
      statementKey: arrayInfo.fieldName,
      isArrayRelevant: arrayInfo.isArrayRelevant,
      displayIndexOffset: arrayInfo.indexOffset,
      hiddenFields: arrayInfo.hiddenFields,
    },
  } as Record<string, ArrayConfigServer>;
};
