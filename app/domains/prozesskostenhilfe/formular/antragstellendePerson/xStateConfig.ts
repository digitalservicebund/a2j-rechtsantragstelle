import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularAntragstellendePersonPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/pages";
import type { ProzesskostenhilfeAntragstellendePersonUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/userData";
import { getProzesskostenhilfeVereinfachteErklaerungConfig } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/xStateConfig";
import type {
  Config,
  FlowConfigTransitions,
} from "~/services/flow/server/buildFlowController";
import {
  antragstellendePersonDone,
  couldLiveFromUnterhalt,
  unterhaltBekommeIch,
  empfaengerIsAnderePerson,
  empfaengerIsChild,
} from "./guards";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularAntragstellendePersonPages,
);

export const getProzesskostenhilfeAntragstellendePersonConfig = (
  transitions?: FlowConfigTransitions,
) => {
  const nextFlowEntrypoint = Array.isArray(transitions?.nextFlowEntrypoint)
    ? transitions.nextFlowEntrypoint
    : [transitions?.nextFlowEntrypoint];
  return {
    id: "antragstellende-person",
    initial: steps.empfaenger.relative,
    meta: { done: antragstellendePersonDone },
    states: {
      [steps.empfaenger.relative]: {
        on: {
          BACK: transitions?.backToCallingFlow,
          SUBMIT: [
            {
              guard: empfaengerIsChild,
              target: "vereinfachte-erklaerung",
            },
            {
              guard: empfaengerIsAnderePerson,
              target: steps.zweiFormulare.relative,
            },
            steps.unterhaltsanspruch.relative,
          ],
        },
      },
      "vereinfachte-erklaerung":
        getProzesskostenhilfeVereinfachteErklaerungConfig({
          backToCallingFlow: "#antragstellende-person.empfaenger",
          nextFlowEntrypoint,
        }),
      [steps.unterhaltsanspruch.relative]: {
        on: {
          BACK: steps.empfaenger.relative,
          SUBMIT: [
            {
              guard: ({ context }) =>
                context.unterhaltsanspruch === "anspruchNoUnterhalt",
              target: steps.unterhaltLebenFrage.relative,
            },
            {
              guard: ({ context }) =>
                context.unterhaltsanspruch === "unterhalt",
              target: steps.unterhalt.relative,
            },
            ...nextFlowEntrypoint,
          ],
        },
      },
      [steps.unterhaltLebenFrage.relative]: {
        on: {
          BACK: steps.unterhaltsanspruch.relative,
          SUBMIT: [
            {
              guard: couldLiveFromUnterhalt,
              target: steps.unterhaltspflichtigePersonBeziehung.relative,
            },
            ...nextFlowEntrypoint,
          ],
        },
      },
      [steps.unterhaltspflichtigePersonBeziehung.relative]: {
        on: {
          BACK: steps.unterhaltLebenFrage.relative,
          SUBMIT: steps.warumKeinerUnterhalt.relative,
        },
      },
      [steps.warumKeinerUnterhalt.relative]: {
        on: {
          BACK: steps.unterhaltspflichtigePersonBeziehung.relative,
          SUBMIT: nextFlowEntrypoint,
        },
      },
      [steps.unterhalt.relative]: {
        on: {
          BACK: steps.unterhaltsanspruch.relative,
          SUBMIT: steps.unterhaltHauptsaechlichesLeben.relative,
        },
      },
      [steps.unterhaltHauptsaechlichesLeben.relative]: {
        on: {
          BACK: steps.unterhalt.relative,
          SUBMIT: [
            {
              guard: unterhaltBekommeIch,
              target: steps.unterhaltspflichtigePerson.relative,
            },
            ...nextFlowEntrypoint,
          ],
        },
      },
      [steps.unterhaltspflichtigePerson.relative]: {
        on: {
          BACK: steps.unterhaltHauptsaechlichesLeben.relative,
          SUBMIT: steps.eigenesExemplar.relative,
        },
      },
      [steps.eigenesExemplar.relative]: {
        on: {
          BACK: steps.unterhaltspflichtigePerson.relative,
          SUBMIT: nextFlowEntrypoint,
        },
      },
      [steps.zweiFormulare.relative]: {
        on: {
          BACK: steps.empfaenger.relative,
          SUBMIT: "#finanzielle-angaben",
        },
      },
    },
  } satisfies Config<ProzesskostenhilfeAntragstellendePersonUserData>;
};
