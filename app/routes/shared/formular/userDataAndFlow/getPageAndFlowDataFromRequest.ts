import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";

export const getPageAndFlowDataFromRequest = (request: Request) => {
  const { pathname } = new URL(request.url);
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);

  const currentFlow = flows[flowId];

  return {
    flowId,
    stepId,
    arrayIndexes,
    currentFlow,
  };
};
