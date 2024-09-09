import _ from "lodash";
import type { Context } from "~/flows/contexts";
import type { GenericGuard } from "~/flows/guards.server";
import finanzielleAngabenPartnerFlow from "~/flows/shared/finanzielleAngaben/partner/flow.json";
import { interpolateDeep } from "~/util/fillTemplate";

export type TargetReplacements = {
  backStep: string;
  playsNoRoleTarget: string;
  partnerNameTarget: string;
  partnerIncomeTarget: string;
  nextStep: string;
};

export function getFinanzielleAngabenPartnerSubflow<T extends Context>(
  doneFunction: GenericGuard<T>,
  targetReplacements: TargetReplacements,
) {
  return interpolateDeep(
    _.merge(_.cloneDeep(finanzielleAngabenPartnerFlow), {
      meta: { done: doneFunction },
    }),
    targetReplacements,
  );
}
