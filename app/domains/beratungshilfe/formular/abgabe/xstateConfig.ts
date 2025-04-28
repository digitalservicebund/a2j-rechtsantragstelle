import type { AbgabeContext } from "~/domains/shared/formular/abgabe/context";
import { config } from "~/services/env/env.server";
import { isFeatureFlagEnabled } from "~/services/featureFlags";
import type { Config } from "~/services/flow/server/buildFlowController";
import { beratungshilfeAbgabeGuards } from "./guards";

export const abgabeXstateConfig = async (backDestination: string) => {
  const showZusammenfassung = config().ENVIRONMENT !== "production";
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
          target: "art",
        },
      },
      art: {
        on: {
          BACK: showZusammenfassung
            ? "#zusammenfassung"
            : "#persoenliche-daten.telefonnummer",
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
  } satisfies Config<AbgabeContext>;
};
