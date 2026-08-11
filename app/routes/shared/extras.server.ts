import { type FlowId } from "~/domains/flowIds";
import { erbfolgeVorabcheckLoaderExtras } from "~/domains/nachlass/erbschein/erbfolge/vorabcheckExtras";
import type { VorabcheckLoaderExtras } from "~/routes/shared/newEngineVorabcheck.server";

type SharedVorabcheckLoaderExtras = VorabcheckLoaderExtras<
  Record<string, unknown>
>;

const extrasByFlowId: Partial<Record<FlowId, SharedVorabcheckLoaderExtras>> = {
  "/nachlass/erbschein/erbfolge": erbfolgeVorabcheckLoaderExtras,
};

export function resolveVorabcheckLoaderExtras(
  flowId: FlowId,
): SharedVorabcheckLoaderExtras | undefined {
  return extrasByFlowId[flowId];
}
