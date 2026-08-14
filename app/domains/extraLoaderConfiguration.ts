import { type ReactNode } from "react";
import { type FlowId } from "~/domains/flowIds";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import { erbfolgeExtras } from "~/domains/nachlass/erbschein/shared/erbfolgeExtras";

type ExtraFlowLoaderData = Record<string, unknown>;

export type FlowExtras<
  ExtraLoaderData extends Record<string, unknown> = Record<string, unknown>,
> = {
  renderExtraComponents(loaderData: ExtraLoaderData): ReactNode;
  getDynamicOptions(loaderData: ExtraLoaderData): DynamicOptions | undefined;
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
