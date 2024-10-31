import type { AbgabeContext } from "~/domains/shared/abgabe/context";
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
        target: "art",
      },
    },
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
        BACK: "#persoenliche-daten.telefonnummer",
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
