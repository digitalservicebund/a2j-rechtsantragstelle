import type { AbgabeContext } from "~/domains/shared/formular/abgabe/context";
import { isFeatureFlagEnabled } from "~/services/featureFlags";
import type { Config } from "~/services/flow/server/buildFlowController";
import { beratungshilfeAbgabeGuards } from "./guards";

export const abgabeXstateConfig = {
  initial: "ueberpruefung",
  id: "abgabe",
  meta: { done: () => false },
  states: {
    ueberpruefung: {
      on: {
        BACK: "#persoenliche-daten.telefonnummer",
      },
      always: {
        guard: beratungshilfeAbgabeGuards.readyForAbgabe,
        target: (await isFeatureFlagEnabled("showFileUpload"))
          ? "dokumente"
          : "art",
      },
    },
    ...((await isFeatureFlagEnabled("showFileUpload")) && {
      dokumente: {
        on: {
          BACK: "#persoenliche-daten.telefonnummer",
          SUBMIT: "art",
        },
      },
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
        BACK: (await isFeatureFlagEnabled("showFileUpload"))
          ? "dokumente"
          : "#persoenliche-daten.telefonnummer",
      },
    },
    ausdrucken: {
      on: {
        BACK: {
          target: "art",
        },
      },
    },
    online: {
      on: {
        BACK: {
          target: "art",
        },
      },
    },
  },
} satisfies Config<AbgabeContext>;
