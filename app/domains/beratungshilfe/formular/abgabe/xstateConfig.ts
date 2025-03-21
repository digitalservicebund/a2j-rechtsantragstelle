import type { AbgabeContext } from "~/domains/shared/formular/abgabe/context";
import { isFeatureFlagEnabled } from "~/services/featureFlags";
import type { Config } from "~/services/flow/server/buildFlowController";
import { beratungshilfeAbgabeGuards } from "./guards";

export const abgabeXstateConfig = async (backDestination: string) => {
  const showFileUpload = await isFeatureFlagEnabled("showFileUpload");
  return {
    initial: "ueberpruefung",
    id: "abgabe",
    meta: { done: () => false },
    states: {
      ueberpruefung: {
        on: { BACK: backDestination },
        always: {
          guard: beratungshilfeAbgabeGuards.readyForAbgabe,
          target: showFileUpload ? "dokumente" : "art",
        },
      },
      ...(showFileUpload && {
        dokumente: { on: { BACK: backDestination, SUBMIT: "art" } },
      }),
      art: {
        on: {
          SUBMIT: [
            {
              target: "online",
              guard: beratungshilfeAbgabeGuards.abgabeOnline,
            },
            {
              target: "ausdrucken",
              guard: beratungshilfeAbgabeGuards.abgabeAusdrucken,
            },
          ],
          BACK: showFileUpload ? "dokumente" : backDestination,
        },
      },
      ausdrucken: {
        on: { BACK: { target: "art" } },
      },
      online: { on: { BACK: { target: "art" } } },
    },
  } satisfies Config<AbgabeContext>;
};
