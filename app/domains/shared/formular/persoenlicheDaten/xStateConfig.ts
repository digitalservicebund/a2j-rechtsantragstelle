import { type GenericGuard } from "~/domains/guards.server";
import { type PersoenlicheDatenUserData } from "~/domains/shared/formular/persoenlicheDaten/userData";
import {
  type FlowConfigTransitions,
  type Config,
} from "~/services/flow/server/buildFlowController";

export function getPersoenlicheDatenXstateConfig(
  doneFunction: GenericGuard<PersoenlicheDatenUserData>,
  transitions?: FlowConfigTransitions,
  subsequentStates?: Config<PersoenlicheDatenUserData>["states"],
): Config<PersoenlicheDatenUserData> {
  return {
    id: "persoenliche-daten",
    initial: "start",
    meta: {
      done: doneFunction,
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
          SUBMIT: "plz",
        },
      },
      plz: {
        on: {
          BACK: "geburtsdatum",
          SUBMIT: "adresse",
        },
      },
      adresse: {
        on: {
          BACK: "plz",
          SUBMIT: "telefonnummer",
        },
      },
      telefonnummer: {
        on: {
          BACK: "adresse",
          SUBMIT: transitions?.nextFlowEntrypoint,
        },
      },
      ...subsequentStates,
    },
  };
}
