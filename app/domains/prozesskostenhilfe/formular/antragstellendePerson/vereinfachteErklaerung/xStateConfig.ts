import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import {
  childLivesSeparately,
  frageVermoegen,
  hasEinnahmen,
  hasEinnahmenAndEmptyArray,
  hasVermoegen,
  hasVermoegenAndEmptyArray,
  unterhaltsOrAbstammungssachen,
  vermoegenUnder10000,
} from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/guards";
import { pkhFormularVereinfachteErklaerungPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/pages";
import { type ProzesskostenhilfeVereinfachteErklaerungUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/userData";
import type {
  Config,
  FlowConfigTransitions,
} from "~/services/flow/server/types";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularVereinfachteErklaerungPages,
);

export const getProzesskostenhilfeVereinfachteErklaerungConfig = (
  transitions?: FlowConfigTransitions,
) => {
  const nextFlowEntrypoint = Array.isArray(transitions?.nextFlowEntrypoint)
    ? transitions.nextFlowEntrypoint
    : [transitions?.nextFlowEntrypoint];
  return {
    id: "vereinfachte-erklaerung",
    initial: steps.kind.relative,
    states: {
      kind: {
        on: {
          BACK: transitions?.backToCallingFlow,
          SUBMIT: steps.zusammenleben.relative,
        },
      },
      [steps.zusammenleben.relative]: {
        on: {
          BACK: steps.kind.relative,
          SUBMIT: [
            { guard: childLivesSeparately, target: steps.veUnterhalt.relative },
            steps.minderjaehrig.relative,
          ],
        },
      },
      [steps.veUnterhalt.relative]: {
        on: {
          BACK: steps.zusammenleben.relative,
          SUBMIT: steps.minderjaehrig.relative,
        },
      },
      [steps.minderjaehrig.relative]: {
        on: {
          BACK: [
            {
              guard: childLivesSeparately,
              target: steps.veUnterhalt.relative,
            },
            steps.zusammenleben.relative,
          ],
          SUBMIT: steps.veGeburtsdatum.relative,
        },
      },
      [steps.veGeburtsdatum.relative]: {
        on: {
          BACK: steps.minderjaehrig.relative,
          SUBMIT: steps.worumGehts.relative,
        },
      },
      [steps.worumGehts.relative]: {
        on: {
          BACK: steps.veGeburtsdatum.relative,
          SUBMIT: [
            {
              guard: unterhaltsOrAbstammungssachen,
              target: steps.rechtlichesThema.relative,
            },
            steps.einnahmen.relative,
          ],
        },
      },
      [steps.rechtlichesThema.relative]: {
        on: {
          BACK: steps.worumGehts.relative,
          SUBMIT: steps.einnahmen.relative,
        },
      },
      [steps.einnahmen.relative]: {
        initial: steps.einnahmenFrage.relative,
        states: {
          [steps.einnahmenFrage.relative]: {
            on: {
              BACK: [
                {
                  guard: unterhaltsOrAbstammungssachen,
                  target: steps.rechtlichesThema.absolute,
                },
                steps.worumGehts.absolute,
              ],
              SUBMIT: [
                {
                  guard: hasEinnahmen,
                  target: steps.einnahmenValue.absolute,
                },
                {
                  guard: frageVermoegen,
                  target: steps.vermoegen.absolute,
                },
                steps.hinweisWeiteresFormular.absolute,
              ],
            },
          },
          [steps.einnahmenValue.relative]: {
            on: {
              SUBMIT: steps.einnahmenUebersicht.relative,
              BACK: steps.einnahmenFrage.relative,
            },
          },
          [steps.einnahmenUebersicht.relative]: {
            id: steps.einnahmenUebersicht.relative,
            on: {
              BACK: steps.einnahmenValue.relative,
              SUBMIT: [
                {
                  guard: hasEinnahmenAndEmptyArray,
                  target: steps.einnahmenWarnung.relative,
                },
                {
                  guard: frageVermoegen,
                  target: steps.vermoegen.absolute,
                },
                steps.hinweisWeiteresFormular.absolute,
              ],
              "add-einnahmen": "#einnahme",
            },
          },
          [steps.einnahme.relative]: {
            id: "einnahme",
            initial: "daten",
            states: {
              daten: {
                on: {
                  SUBMIT: steps.einnahmenUebersicht.absolute,
                  BACK: steps.einnahmenUebersicht.absolute,
                },
              },
            },
          },
          [steps.einnahmenWarnung.relative]: {
            on: {
              BACK: steps.einnahmenUebersicht.relative,
              SUBMIT: [
                {
                  guard: frageVermoegen,
                  target: steps.vermoegen.absolute,
                },
                steps.hinweisWeiteresFormular.absolute,
              ],
            },
          },
        },
      },
      [steps.vermoegen.relative]: {
        initial: steps.vermoegenFrage.relative,
        states: {
          [steps.vermoegenFrage.relative]: {
            on: {
              BACK: [
                {
                  guard: ({ context }) => !hasEinnahmen({ context }),
                  target: steps.einnahmen.absolute,
                },
                steps.einnahmenUebersicht.absolute,
              ],
              SUBMIT: [
                { guard: hasVermoegen, target: steps.vermoegenValue.relative },
                steps.hinweisVereinfachteErklaerung.absolute,
              ],
            },
          },
          [steps.vermoegenValue.relative]: {
            on: {
              BACK: steps.vermoegenFrage.relative,
              SUBMIT: [
                {
                  guard: vermoegenUnder10000,
                  target: steps.vermoegenUebersicht.relative,
                },
                steps.hinweisWeiteresFormular.absolute,
              ],
            },
          },
          [steps.vermoegenUebersicht.relative]: {
            id: steps.vermoegenUebersicht.relative,
            on: {
              BACK: steps.vermoegenValue.relative,
              SUBMIT: [
                {
                  guard: hasVermoegenAndEmptyArray,
                  target: steps.vermoegenWarnung.relative,
                },
                steps.hinweisVereinfachteErklaerung.absolute,
              ],
              "add-vermoegen": steps.vermoegenEintrag.absolute,
            },
          },
          [steps.vermoegenEintrag.relative]: {
            id: "vermoegen-eintrag",
            initial: "daten",
            states: {
              daten: {
                on: {
                  SUBMIT: steps.vermoegenUebersicht.absolute,
                  BACK: steps.vermoegenUebersicht.absolute,
                },
              },
            },
          },
          [steps.vermoegenWarnung.relative]: {
            on: {
              BACK: steps.vermoegenUebersicht.relative,
              SUBMIT: steps.hinweisVereinfachteErklaerung.absolute,
            },
          },
        },
      },
      [steps.hinweisWeiteresFormular.relative]: {
        on: {
          BACK: [
            {
              guard: ({ context }) =>
                hasVermoegen({ context }) && !vermoegenUnder10000({ context }),
              target: steps.vermoegenValue.absolute,
            },
            {
              guard: hasEinnahmen,
              target: steps.einnahmenUebersicht.absolute,
            },
            steps.einnahmen.relative,
          ],
          SUBMIT: nextFlowEntrypoint,
        },
      },
      [steps.hinweisVereinfachteErklaerung.relative]: {
        on: {
          BACK: [
            {
              guard: ({ context }) =>
                hasVermoegen({ context }) && vermoegenUnder10000({ context }),
              target: steps.vermoegenUebersicht.absolute,
            },
            {
              guard: ({ context }) => !hasVermoegen({ context }),
              target: steps.vermoegen.absolute,
            },
          ],
          SUBMIT: nextFlowEntrypoint,
        },
      },
    },
  } satisfies Config<ProzesskostenhilfeVereinfachteErklaerungUserData>;
};
