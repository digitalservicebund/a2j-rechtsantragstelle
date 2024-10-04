import type { Context } from "~/flows/contexts";
import type { GenericGuard } from "~/flows/guards.server";
import type { Config } from "~/services/flow/server/buildFlowController";

export function getAbgabeXstateConfig(transitions?: {
  readyForAbgabe?: GenericGuard<Context>;
}): Config {
  return {
    id: "abgabe",
    initial: "ueberpruefung",
    meta: { done: () => false },
    states: {
      ueberpruefung: {
        on: {
          BACK: "#persoenliche-daten.beruf",
        },
        always: { guard: transitions?.readyForAbgabe, target: "ende" },
      },
      ende: {
        on: {
          BACK: "#persoenliche-daten.beruf",
        },
      },
    },
  };
}
