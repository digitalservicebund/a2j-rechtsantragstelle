import { type GenericGuard } from "~/domains/guards.server";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type SharedPersoenlicheDatenUserData } from "~/domains/shared/formular/persoenlicheDaten/userData";
import {
  type FlowConfigTransitions,
  type Config,
} from "~/services/flow/server/buildFlowController";
import { sharedPersoenlicheDatenPages } from "./pages";

const steps = xStateTargetsFromPagesConfig(sharedPersoenlicheDatenPages);
export function getPersoenlicheDatenXstateConfig(
  doneFunction: GenericGuard<SharedPersoenlicheDatenUserData>,
  transitions?: FlowConfigTransitions,
  subsequentStates?: Config<SharedPersoenlicheDatenUserData>["states"],
): Config<SharedPersoenlicheDatenUserData> {
  return {
    id: "persoenliche-daten",
    initial: "start",
    meta: {
      done: doneFunction,
    },
    states: {
      start: {
        on: {
          SUBMIT: steps.name.relative,
          BACK: transitions?.backToCallingFlow,
        },
      },
      [steps.name.relative]: {
        on: {
          BACK: "start",
          SUBMIT: steps.geburtsdatum.relative,
        },
      },
      [steps.geburtsdatum.relative]: {
        on: {
          BACK: steps.name.relative,
          SUBMIT: steps.plz.relative,
        },
      },
      [steps.plz.relative]: {
        on: {
          BACK: steps.geburtsdatum.relative,
          SUBMIT: steps.adresse.relative,
        },
      },
      [steps.adresse.relative]: {
        on: {
          BACK: steps.plz.relative,
          SUBMIT: steps.telefonnummer.relative,
        },
      },
      [steps.telefonnummer.relative]: {
        on: {
          BACK: steps.adresse.relative,
          SUBMIT: transitions?.nextFlowEntrypoint,
        },
      },
      ...subsequentStates,
    },
  };
}
