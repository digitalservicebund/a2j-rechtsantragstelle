import type { FlowType } from "~/flows/flows.server";
import type { FlowPageApiId } from "./schemas";

const apiMapping = {
  formFlow: "form-flow-pages",
  vorabCheck: "vorab-check-pages",
} satisfies Record<FlowType, FlowPageApiId>;

export const flowPageApiIdFromFlowType = (flowType: FlowType) =>
  apiMapping[flowType];
