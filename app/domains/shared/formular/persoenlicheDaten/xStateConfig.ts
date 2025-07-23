import mapValues from 'lodash/mapValues';
import { beratungshilfeAntragPages } from '~/domains/beratungshilfe/formular/pages';
import { type GenericGuard } from "~/domains/guards.server";
import { type PersoenlicheDatenUserData } from "~/domains/shared/formular/persoenlicheDaten/userData";
import {
  type FlowConfigTransitions,
  type Config,
} from "~/services/flow/server/buildFlowController";

const stepIds = mapValues(beratungshilfeAntragPages, (v) => v.stepId);

export function getPersoenlicheDatenXstateConfig(
  doneFunction: GenericGuard<PersoenlicheDatenUserData>,
  transitions?: FlowConfigTransitions,
  subsequentStates?: Config<PersoenlicheDatenUserData>["states"],
): Config<PersoenlicheDatenUserData> {
  return {
    id: stepIds.persoenlicheDaten,
    initial: stepIds.persoenlicheDatenStart,
    meta: {
      done: doneFunction,
    },
    states: {
      [stepIds.persoenlicheDatenStart]: {
        on: {
          SUBMIT: stepIds.persoenlicheDatenStart,
          BACK: transitions?.backToCallingFlow,
        },
      },
      [stepIds.persoenlicheDatenName]: {
        on: {
          BACK: stepIds.persoenlicheDatenStart,
          SUBMIT: stepIds.persoenlicheDatenGeburtsdatum,
        },
      },
      [stepIds.persoenlicheDatenGeburtsdatum]: {
        on: {
          BACK: stepIds.persoenlicheDatenName,
          SUBMIT: stepIds.persoenlicheDatenPLZ,
        },
      },
      [stepIds.persoenlicheDatenPLZ]: {
        on: {
          BACK: stepIds.persoenlicheDatenGeburtsdatum,
          SUBMIT: stepIds.persoenlicheDatenAdresse,
        },
      },
      [stepIds.persoenlicheDatenAdresse]: {
        on: {
          BACK: stepIds.persoenlicheDatenPLZ,
          SUBMIT: stepIds.persoenlicheDatenTelefonnummer,
        },
      },
      [stepIds.persoenlicheDatenTelefonnummer]: {
        on: {
          BACK: stepIds.persoenlicheDatenAdresse,
          SUBMIT: transitions?.nextFlowEntrypoint,
        },
      },
      ...subsequentStates,
    },
  };
}
