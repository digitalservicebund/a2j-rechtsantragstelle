import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { hasGesetzlicheVertretungYes } from "~/domains/prozesskostenhilfe/formular/gesetzlicheVertretung/guards";
import { pkhFormularGesetzlicheVertretungPages } from "~/domains/prozesskostenhilfe/formular/gesetzlicheVertretung/pages";
import type {
  Config,
  FlowConfigTransitions,
} from "~/services/flow/server/buildFlowController";
import { prozesskostenhilfeGesetzlicheVertretungDone } from "./doneFunctions";
import type { ProzesskostenhilfeGesetzlicheVertretungUserData } from "./userData";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularGesetzlicheVertretungPages,
);

export function gesetzlicheVertretungXstateConfig(
  transitions?: FlowConfigTransitions,
): Config<ProzesskostenhilfeGesetzlicheVertretungUserData> {
  return {
    id: "gesetzliche-vertretung",
    initial: steps.gesetzlicheVertretungFrage.relative,
    meta: { done: prozesskostenhilfeGesetzlicheVertretungDone },
    states: {
      [steps.gesetzlicheVertretungFrage.relative]: {
        on: {
          SUBMIT: [
            {
              guard: hasGesetzlicheVertretungYes,
              target: steps.gesetzlicheVertretungDaten.relative,
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
          BACK: steps.gesetzlicheVertretungFrage.relative,
        },
      },
    },
  };
}
