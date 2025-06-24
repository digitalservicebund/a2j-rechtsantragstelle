import { hasOptionalString } from "~/domains/guards.server";
import type {
  Config,
  FlowConfigTransitions,
} from "~/services/flow/server/buildFlowController";
import { prozesskostenhilfePersoenlicheDatenDone } from "./doneFunctions";
import type { ProzesskostenhilfePersoenlicheDatenUserData } from "./userData";

export function getProzesskostenhilfePersoenlicheDatenXstateConfig(
  transitions?: FlowConfigTransitions,
): Config<ProzesskostenhilfePersoenlicheDatenUserData> {
  return {
    id: "persoenliche-daten",
    initial: "start",
    meta: {
      done: ({ context }) =>
        prozesskostenhilfePersoenlicheDatenDone({ context }) &&
        hasOptionalString(context.telefonnummer as Partial<string>),
    },
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
