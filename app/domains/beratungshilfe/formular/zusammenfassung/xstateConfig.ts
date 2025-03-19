import type { AbgabeContext } from "~/domains/shared/formular/abgabe/context";
import type { Config } from "~/services/flow/server/buildFlowController";

export const zusammenfassungXstateConfig = {
  id: "zusammenfassung",
  initial: "ueberblick",
  meta: { done: () => true },
  states: {
    ueberblick: {
      on: {
        BACK: "#persoenliche-daten.telefonnummer",
        SUBMIT: "#abgabe",
      },
    },
  },
} satisfies Config<AbgabeContext>;
