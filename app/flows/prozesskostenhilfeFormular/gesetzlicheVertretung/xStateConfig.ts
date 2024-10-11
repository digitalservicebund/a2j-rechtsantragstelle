import type { Context } from "~/flows/contexts";
import type { GenericGuard } from "~/flows/guards.server";
import type { Config } from "~/services/flow/server/buildFlowController";
import type { ProzesskostenhilfeGesetzlicheVertretung } from "./context";
import { prozesskostenhilfeGesetzlicheVertretungDone } from "./doneFunctions";

export function gesetzlicheVertretungXstateConfig(transitions?: {
  backToCallingFlow?:
    | string
    | (string | { guard: GenericGuard<Context>; target: string })[];
  nextFlowEntrypoint?: string;
}): Config<ProzesskostenhilfeGesetzlicheVertretung> {
  return {
    id: "gesetzliche-vertretung",
    initial: "frage",
    meta: { done: prozesskostenhilfeGesetzlicheVertretungDone },
    states: {
      frage: {
        on: {
          SUBMIT: [
            {
              guard: ({ context }) =>
                context.hasGesetzlicheVertretung === "yes",
              target: "daten",
            },
            transitions?.nextFlowEntrypoint,
          ],
          BACK: transitions?.backToCallingFlow,
        },
      },
      daten: {
        on: {
          SUBMIT: transitions?.nextFlowEntrypoint,
          BACK: "frage",
        },
      },
    },
  };
}
