import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import type { Guards } from "../../../guards.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { beratungshilfeXstateConfig } from "../xstateConfig";
import { reduceExcludedStatesToId } from "~/services/flow/reduceExcludedStatesToId";

export const beratungshilfeAbgabeGuards = {
  readyForAbgabe: ({ context }): boolean => {
    const configWithoutAbgabe = reduceExcludedStatesToId(
      beratungshilfeXstateConfig,
    );
    const stepStates = buildFlowController({
      config: configWithoutAbgabe,
      data: context,
    }).stepStates();
    return stepStates
      .filter((stepState) => stepState.isReachable)
      .every((stepState) => stepState.isDone);
  },
  abgabeOnline: ({ context }) => context.abgabeArt == "online",
  abgabeAusdrucken: ({ context }) => context.abgabeArt == "ausdrucken",
} satisfies Guards<BeratungshilfeFormularUserData>;
