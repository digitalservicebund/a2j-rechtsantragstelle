import _ from "lodash";
import type { Context } from "~/flows/contexts";
import type { GenericGuard } from "~/flows/guards.server";
import { persoenlicheDatenDone } from "~/flows/shared/persoenlicheDaten/doneFunctions";
import persoenlicheDatenFlow from "~/flows/shared/persoenlicheDaten/flow.json";
import { interpolateSerializableObject } from "~/util/fillTemplate";

export type PersoenlicheDatenTargetReplacements = {
  nextStep: string;
};

export function getPersoenlicheDatenSubflow<T extends Context>(
  targetReplacements: PersoenlicheDatenTargetReplacements,
  doneFunction?: GenericGuard<T>,
) {
  return _.merge(
    interpolateSerializableObject(persoenlicheDatenFlow, targetReplacements),
    {
      meta: { done: doneFunction ?? persoenlicheDatenDone },
    },
  );
}
