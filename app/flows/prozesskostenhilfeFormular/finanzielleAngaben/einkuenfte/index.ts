import _ from "lodash";
import type { ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard } from "~/flows/prozesskostenhilfeFormular/finanzielleAngaben/einkuenfte/doneFunctions";
import { interpolateDeep } from "~/util/fillTemplate";
import einkuenfteFlow from "./flow.json";

export type ProzesskostenhilfeEinkuenfteTargetReplacements = {
  prefix: string;
};

export function getProzesskostenhilfeEinkuenfteSubflow(
  doneFunction: ProzesskostenhilfeFinanzielleAngabenEinkuenfteGuard,
  targetReplacements: ProzesskostenhilfeEinkuenfteTargetReplacements,
) {
  return _.merge(interpolateDeep(einkuenfteFlow, targetReplacements), {
    meta: { done: doneFunction },
  });
}
