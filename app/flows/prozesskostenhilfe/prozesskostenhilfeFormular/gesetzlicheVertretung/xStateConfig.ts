import type {
  Config,
  FlowConfigTransitions,
} from "~/services/flow/server/buildFlowController";
import type { ProzesskostenhilfeGesetzlicheVertretung } from "./context";
import { prozesskostenhilfeGesetzlicheVertretungDone } from "./doneFunctions";

export function gesetzlicheVertretungXstateConfig(
  transitions?: FlowConfigTransitions,
): Config<ProzesskostenhilfeGesetzlicheVertretung> {
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
            ...(Array.isArray(transitions?.nextFlowEntrypoint)
              ? transitions.nextFlowEntrypoint
              : [transitions?.nextFlowEntrypoint]),
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
