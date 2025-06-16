import {
  childLivesSeparately,
  frageVermoegen,
  hasEinnahmen,
  hasEinnahmenAndEmptyArray,
  hasVermoegen,
  hasVermoegenAndEmptyArray,
  unterhaltsOrAbstammungssachen,
  vereinfachteErklaerungDone,
  vermoegenUnder10000,
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
          SUBMIT: "geburtsdatum",
        },
      },
      geburtsdatum: {
        on: { BACK: "minderjaehrig", SUBMIT: "worum-gehts" },
      },
      "worum-gehts": {
        on: {
          BACK: "geburtsdatum",
          SUBMIT: [
            {
              guard: unterhaltsOrAbstammungssachen,
              target: "rechtliches-thema",
            },
            "einnahmen",
          ],
        },
      },
      "rechtliches-thema": {
        on: {
          BACK: "worum-gehts",
          SUBMIT: "einnahmen",
        },
      },
      einnahmen: {
        on: {
          BACK: [
            {
              guard: unterhaltsOrAbstammungssachen,
              target: "rechtliches-thema",
            },
            "worum-gehts",
          ],
          SUBMIT: [
            {
              guard: hasEinnahmen,
              target: "einnahmen-value",
            },
            {
              guard: frageVermoegen,
              target: "vermoegen",
            },
            "hinweis-weiteres-formular",
          ],
        },
      },
      "einnahmen-value": {
        on: {
          SUBMIT: "einnahmen-uebersicht",
          BACK: "einnahmen",
        },
      },
      "einnahmen-uebersicht": {
        id: "einnahmen-uebersicht",
        on: {
          BACK: "einnahmen-value",
          SUBMIT: [
            {
              guard: hasEinnahmenAndEmptyArray,
              target: "einnahmen-warnung",
            },
            {
              guard: frageVermoegen,
              target: "vermoegen",
            },
            "hinweis-weiteres-formular",
          ],
          "add-einnahmen": "#einnahme",
        },
      },
      einnahme: {
        id: "einnahme",
        initial: "daten",
        states: {
          daten: {
            on: {
              SUBMIT: "#einnahmen-uebersicht",
              BACK: "#einnahmen-uebersicht",
            },
          },
        },
      },
      "einnahmen-warnung": {
        on: {
          BACK: "einnahmen-uebersicht",
          SUBMIT: [
            {
              guard: frageVermoegen,
              target: "vermoegen",
            },
            "hinweis-weiteres-formular",
          ],
        },
      },
      vermoegen: {
        on: {
          BACK: [
            {
              guard: ({ context }) => !hasEinnahmen({ context }),
              target: "einnahmen",
            },
            "einnahmen-uebersicht",
          ],
          SUBMIT: [
            { guard: hasVermoegen, target: "vermoegen-value" },
            "hinweis-vereinfachte-erklaerung",
          ],
        },
      },
      "vermoegen-value": {
        on: {
          BACK: "vermoegen",
          SUBMIT: [
            { guard: vermoegenUnder10000, target: "vermoegen-uebersicht" },
            "hinweis-weiteres-formular",
          ],
        },
      },
      "vermoegen-uebersicht": {
        id: "vermoegen-uebersicht",
        on: {
          BACK: "vermoegen-value",
          SUBMIT: [
            {
              guard: hasVermoegenAndEmptyArray,
              target: "vermoegen-warnung",
            },
            "hinweis-vereinfachte-erklaerung",
          ],
          "add-vermoegen": "#vermoegen-eintrag",
        },
      },
      "vermoegen-eintrag": {
        id: "vermoegen-eintrag",
        initial: "daten",
        states: {
          daten: {
            on: {
              SUBMIT: "#vermoegen-uebersicht",
              BACK: "#vermoegen-uebersicht",
            },
          },
        },
      },
      "vermoegen-warnung": {
        on: {
          BACK: "vermoegen-uebersicht",
          SUBMIT: "hinweis-vereinfachte-erklaerung",
        },
      },
      "hinweis-weiteres-formular": {
        on: {
          BACK: [
            {
              guard: ({ context }) =>
                hasVermoegen({ context }) && !vermoegenUnder10000({ context }),
              target: "vermoegen-value",
            },
            {
              guard: hasEinnahmen,
              target: "einnahmen-uebersicht",
            },
            "einnahmen",
          ],
          SUBMIT: nextFlowEntrypoint,
        },
      },
      "hinweis-vereinfachte-erklaerung": {
        on: {
          BACK: [
            {
              guard: ({ context }) =>
                hasVermoegen({ context }) && vermoegenUnder10000({ context }),
              target: "vermoegen-uebersicht",
            },
            {
              guard: ({ context }) => !hasVermoegen({ context }),
              target: "vermoegen",
            },
          ],
          SUBMIT: nextFlowEntrypoint,
        },
      },
    },
  } satisfies Config<ProzesskostenhilfeVereinfachteErklaerungUserData>;
};
