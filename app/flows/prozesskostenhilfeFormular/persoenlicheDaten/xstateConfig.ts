import type {
  Config,
  FlowConfigTransitions,
} from "~/services/flow/server/buildFlowController";
import type { ProzesskostenhilfePersoenlicheDaten } from "./context";
import { prozesskostenhilfePersoenlicheDatenDone } from "./doneFunctions";

export function getProzesskostenhilfePersoenlicheDatenXstateConfig(
  transitions?: FlowConfigTransitions,
): Config<ProzesskostenhilfePersoenlicheDaten> {
  return {
    id: "persoenliche-daten",
    initial: "start",
    meta: { done: prozesskostenhilfePersoenlicheDatenDone },
    states: {
      start: {
        on: {
          SUBMIT: "name",
          BACK: transitions?.backToCallingFlow,
        },
      },
      name: {
        on: {
          BACK: "start",
          SUBMIT: "geburtsdatum",
        },
      },
      geburtsdatum: {
        on: {
          BACK: "name",
          SUBMIT: "adresse",
        },
      },
      adresse: {
        on: {
          BACK: "geburtsdatum",
          SUBMIT: "telefonnummer",
        },
      },
      telefonnummer: {
        on: {
          SUBMIT: "beruf",
          BACK: "adresse",
        },
      },
      beruf: {
        on: {
          BACK: "telefonnummer",
          SUBMIT: transitions?.nextFlowEntrypoint,
        },
      },
    },
  };
}
