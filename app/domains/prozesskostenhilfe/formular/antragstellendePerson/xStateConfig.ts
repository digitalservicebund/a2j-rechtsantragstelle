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

export const getProzesskostenhilfeAntragstellendePersonConfig = (
  transitions?: FlowConfigTransitions,
) => {
  const nextFlowEntrypoint = Array.isArray(transitions?.nextFlowEntrypoint)
    ? transitions.nextFlowEntrypoint
    : [transitions?.nextFlowEntrypoint];
  return {
    id: "antragstellende-person",
    initial: "empfaenger",
    meta: { done: antragstellendePersonDone },
    states: {
      empfaenger: {
        on: {
          BACK: transitions?.backToCallingFlow,
          SUBMIT: [
            {
              guard: empfaengerIsChild,
              target: "vereinfachte-erklaerung",
            },
            {
              guard: empfaengerIsAnderePerson,
              target: "zwei-formulare",
            },
            "unterhaltsanspruch",
          ],
        },
      },
      "vereinfachte-erklaerung":
        getProzesskostenhilfeVereinfachteErklaerungConfig({
          backToCallingFlow: "#antragstellende-person.empfaenger",
          nextFlowEntrypoint,
        }),
      unterhaltsanspruch: {
        on: {
          BACK: "empfaenger",
          SUBMIT: [
            {
              guard: ({ context }) =>
                context.unterhaltsanspruch === "anspruchNoUnterhalt",
              target: "unterhalt-leben-frage",
            },
            {
              guard: ({ context }) =>
                context.unterhaltsanspruch === "unterhalt",
              target: "unterhalt",
            },
            ...nextFlowEntrypoint,
          ],
        },
      },
      "unterhalt-leben-frage": {
        on: {
          BACK: "unterhaltsanspruch",
          SUBMIT: [
            {
              guard: couldLiveFromUnterhalt,
              target: "unterhaltspflichtige-person-beziehung",
            },
            ...nextFlowEntrypoint,
          ],
        },
      },
      "unterhaltspflichtige-person-beziehung": {
        on: {
          BACK: "unterhalt-leben-frage",
          SUBMIT: "warum-keiner-unterhalt",
        },
      },
      "warum-keiner-unterhalt": {
        on: {
          BACK: "unterhaltspflichtige-person-beziehung",
          SUBMIT: nextFlowEntrypoint,
        },
      },
      unterhalt: {
        on: {
          BACK: "unterhaltsanspruch",
          SUBMIT: "unterhalt-hauptsaechliches-leben",
        },
      },
      "unterhalt-hauptsaechliches-leben": {
        on: {
          BACK: "unterhalt",
          SUBMIT: [
            {
              guard: unterhaltBekommeIch,
              target: "unterhaltspflichtige-person",
            },
            ...nextFlowEntrypoint,
          ],
        },
      },
      "unterhaltspflichtige-person": {
        on: {
          BACK: "unterhalt-hauptsaechliches-leben",
          SUBMIT: "eigenes-exemplar",
        },
      },
      "eigenes-exemplar": {
        on: {
          BACK: "unterhaltspflichtige-person",
          SUBMIT: nextFlowEntrypoint,
        },
      },
      "zwei-formulare": {
        on: {
          BACK: "empfaenger",
          SUBMIT: "#finanzielle-angaben",
        },
      },
    },
  } satisfies Config<ProzesskostenhilfeAntragstellendePersonUserData>;
};
