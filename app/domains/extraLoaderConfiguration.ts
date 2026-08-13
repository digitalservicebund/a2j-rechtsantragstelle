import { type ReactNode } from "react";
import { type FlowId } from "~/domains/flowIds";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import { erbfolgeExtras } from "~/domains/nachlass/erbschein/shared/erbfolgeExtras";

export type ExtraFlowLoaderData = Record<string, unknown> & {
  flowId: FlowId;
};

export type FlowExtras<
  TLoaderData extends ExtraFlowLoaderData = ExtraFlowLoaderData,
> = {
  renderExtraComponents(loaderData: TLoaderData): ReactNode;
  getDynamicOptions(loaderData: TLoaderData): DynamicOptions | undefined;
};

const extraFlowFeaturesById: Partial<Record<FlowId, FlowExtras>> = {
  "/nachlass/erbschein/erbfolge": erbfolgeExtras,
};

export function useFlowExtras(loaderData: ExtraFlowLoaderData, flowId: FlowId) {
  const flowExtras = extraFlowFeaturesById[flowId];
  if (!flowExtras) return undefined;
  return {
    extraComponents: flowExtras.renderExtraComponents(loaderData),
    dynamicOptions: flowExtras.getDynamicOptions(loaderData),
  };
}
