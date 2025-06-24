import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";

export const getPageAndFlowDataFromPathname = (pathname: string) => {
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);

  const currentFlow = flows[flowId];

  return {
    flowId,
    stepId,
    arrayIndexes,
    currentFlow,
  };
};
