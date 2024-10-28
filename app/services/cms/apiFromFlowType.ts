import type { FlowType } from "~/flows/flows.server";
import type { FlowPageId } from "./schemas";

const apiMapping = {
  formFlow: "form-flow-pages",
  vorabCheck: "vorab-check-pages",
} satisfies Record<FlowType, FlowPageId>;

export const flowPageApiIdFromFlowType = (flowType: FlowType) =>
  apiMapping[flowType];
