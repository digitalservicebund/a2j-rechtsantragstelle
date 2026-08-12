import { type ReactNode } from "react";
import { type FlowId } from "~/domains/flowIds";
import { type DynamicOptions } from "~/services/validation/dynamicSelect";
import { erbfolgeExtras } from "~/domains/nachlass/erbschein/erbfolge/vorabcheckExtras";

export type VorabcheckExtraLoaderData = Record<string, unknown> & {
  flowId: FlowId;
};

export type VorabcheckExtras<
  TLoaderData extends VorabcheckExtraLoaderData = VorabcheckExtraLoaderData,
> = {
  renderExtraComponents(loaderData: TLoaderData): ReactNode;
  getDynamicOptions(loaderData: TLoaderData): DynamicOptions | undefined;
};

const extrasByFlowId: Partial<Record<FlowId, VorabcheckExtras>> = {
  "/nachlass/erbschein/erbfolge": erbfolgeExtras,
};

export function useVorabcheckExtras(
  loaderData: VorabcheckExtraLoaderData,
  flowId: FlowId,
) {
  const flowExtras = extrasByFlowId[flowId];
  if (!flowExtras) return undefined;
  return {
    extraComponents: flowExtras.renderExtraComponents(loaderData),
    dynamicOptions: flowExtras.getDynamicOptions(loaderData),
  };
}
