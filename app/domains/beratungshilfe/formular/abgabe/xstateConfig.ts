import type { AbgabeUserData } from "~/domains/shared/formular/abgabe/userData";
import { config } from "~/services/env/public";
import type { Config } from "~/services/flow/server/buildFlowController";
import { isFeatureFlagEnabled } from "~/services/isFeatureFlagEnabled.server";
import { beratungshilfeAbgabeGuards } from "./guards";

const shouldShowZusammenfassung = config().ENVIRONMENT !== "production";

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
          target: shouldShowZusammenfassung ? "zusammenfassung" : "art",
        },
      },
      zusammenfassung: { on: { BACK: backDestination, SUBMIT: "art" } },
      art: {
        on: {
          BACK: shouldShowZusammenfassung ? "zusammenfassung" : backDestination,
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
