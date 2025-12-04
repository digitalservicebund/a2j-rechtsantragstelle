import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import type { Guards } from "../../../guards.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { beratungshilfeFormular } from "~/domains/beratungshilfe/formular";

export const beratungshilfeAbgabeGuards = {
  readyForAbgabe: ({ context }): boolean => {
    // Need to strip off 'abgabe' lest we infinitely recurse
    const stepStates = buildFlowController({
      config: {
        ...beratungshilfeFormular.config,
        states: {
          ...beratungshilfeFormular.config.states,
          abgabe: {
            id: "abgabe",
          },
        },
      },
      data: context,
      guards: beratungshilfeFormular.guards,
    }).stepStates();
    return stepStates
      .filter((stepState) => stepState.isReachable)
      .every((stepState) => stepState.isDone);
  },
  abgabeOnline: ({ context }) => context.abgabeArt == "online",
  abgabeAusdrucken: ({ context }) => context.abgabeArt == "ausdrucken",
} satisfies Guards<BeratungshilfeFormularUserData>;
