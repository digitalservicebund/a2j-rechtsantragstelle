import type {
  Config,
  FlowConfigTransitions,
} from "~/services/flow/server/buildFlowController";
import { prozesskostenhilfeGesetzlicheVertretungDone } from "./doneFunctions";
import type { ProzesskostenhilfeGesetzlicheVertretungUserData } from "./userData";

export function gesetzlicheVertretungXstateConfig(
  transitions?: FlowConfigTransitions,
): Config<ProzesskostenhilfeGesetzlicheVertretungUserData> {
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
