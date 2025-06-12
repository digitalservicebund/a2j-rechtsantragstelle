import {
  childLivesSeparately,
  vereinfachteErklaerungDone,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";
import { type ProzesskostenhilfeVereinfachteErklaerungUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/userData";
import {
  type Config,
  type FlowConfigTransitions,
} from "~/services/flow/server/buildFlowController";

export const getProzesskostenhilfeVereinfachteErklaerungConfig = (
  transitions?: FlowConfigTransitions,
) => {
  const nextFlowEntrypoint = Array.isArray(transitions?.nextFlowEntrypoint)
    ? transitions.nextFlowEntrypoint
    : [transitions?.nextFlowEntrypoint];
  return {
    id: "vereinfachte-erklaerung",
    initial: "kind",
    meta: { done: vereinfachteErklaerungDone },
    states: {
      kind: {
        on: {
          BACK: transitions?.backToCallingFlow,
          SUBMIT: "hinweis-voraussetzung",
        },
      },
      "hinweis-voraussetzung": {
        on: { BACK: "kind", SUBMIT: "zusammenleben" },
      },
      zusammenleben: {
        on: {
          BACK: "hinweis-voraussetzung",
          SUBMIT: [
            { guard: childLivesSeparately, target: "unterhalt" },
            "minderjaehrig",
          ],
        },
      },
      unterhalt: {
        on: { BACK: "zusammenleben", SUBMIT: "minderjaehrig" },
      },
      minderjaehrig: {
        on: {
          BACK: [
            {
              guard: childLivesSeparately,
              target: "unterhalt",
            },
            "zusammenleben",
          ],
          SUBMIT: nextFlowEntrypoint,
        },
      },
    },
  } satisfies Config<ProzesskostenhilfeVereinfachteErklaerungUserData>;
};
