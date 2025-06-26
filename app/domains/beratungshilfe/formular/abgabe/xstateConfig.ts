import type { AbgabeUserData } from "~/domains/shared/formular/abgabe/userData";
import type { Config } from "~/services/flow/server/buildFlowController";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
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
        meta: { expandValidation: true },
        always: {
          guard: beratungshilfeAbgabeGuards.readyForAbgabe,
          target: "zusammenfassung",
        },
      },
      zusammenfassung: { on: { BACK: backDestination, SUBMIT: "art" } },
      art: {
        on: {
          BACK: "zusammenfassung",
          SUBMIT: [
            {
              target: showFileUpload ? "dokumente" : "online",
              guard: beratungshilfeAbgabeGuards.abgabeOnline,
            },
            {
              target: "ausdrucken",
              guard: beratungshilfeAbgabeGuards.abgabeAusdrucken,
            },
          ],
        },
      },

      ...(showFileUpload && {
        dokumente: { on: { BACK: "art", SUBMIT: "online" } },
      }),

      ausdrucken: {
        on: { BACK: { target: "art" } },
      },
      online: {
        on: { BACK: { target: showFileUpload ? "dokumente" : "art" } },
      },
    },
  } satisfies Config<AbgabeUserData>;
};
