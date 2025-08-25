import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
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
import { pkhFormularVereinfachteErklaerungPages } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/pages";
import { type ProzesskostenhilfeVereinfachteErklaerungUserData } from "~/domains/prozesskostenhilfe/formular/antragstellendePerson/vereinfachteErklaerung/userData";
import {
  type Config,
  type FlowConfigTransitions,
} from "~/services/flow/server/buildFlowController";

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
    meta: { done: vereinfachteErklaerungDone },
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
      einnahmen: {
        on: {
          BACK: [
            {
              guard: unterhaltsOrAbstammungssachen,
              target: steps.rechtlichesThema.relative,
            },
            steps.worumGehts.relative,
          ],
          SUBMIT: [
            {
              guard: hasEinnahmen,
              target: steps.einnahmenValue.relative,
            },
            {
              guard: frageVermoegen,
              target: steps.vermoegen.relative,
            },
            steps.hinweisWeiteresFormular.relative,
          ],
        },
      },
      [steps.einnahmenValue.relative]: {
        on: {
          SUBMIT: steps.einnahmenUebersicht.relative,
          BACK: steps.einnahmen.relative,
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
              target: steps.vermoegen.relative,
            },
            steps.hinweisWeiteresFormular.relative,
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
              target: steps.vermoegen.relative,
            },
            steps.hinweisWeiteresFormular.relative,
          ],
        },
      },
      [steps.vermoegen.relative]: {
        on: {
          BACK: [
            {
              guard: ({ context }) => !hasEinnahmen({ context }),
              target: steps.einnahmen.relative,
            },
            steps.einnahmenUebersicht.relative,
          ],
          SUBMIT: [
            { guard: hasVermoegen, target: steps.vermoegenValue.relative },
            steps.hinweisVereinfachteErklaerung.relative,
          ],
        },
      },
      [steps.vermoegenValue.relative]: {
        on: {
          BACK: steps.vermoegen.relative,
          SUBMIT: [
            {
              guard: vermoegenUnder10000,
              target: steps.vermoegenUebersicht.relative,
            },
            steps.hinweisWeiteresFormular.relative,
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
            steps.hinweisVereinfachteErklaerung.relative,
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
          SUBMIT: steps.hinweisVereinfachteErklaerung.relative,
        },
      },
      [steps.hinweisWeiteresFormular.relative]: {
        on: {
          BACK: [
            {
              guard: ({ context }) =>
                hasVermoegen({ context }) && !vermoegenUnder10000({ context }),
              target: steps.vermoegenValue.relative,
            },
            {
              guard: hasEinnahmen,
              target: steps.einnahmenUebersicht.relative,
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
              target: steps.vermoegenUebersicht.relative,
            },
            {
              guard: ({ context }) => !hasVermoegen({ context }),
              target: steps.vermoegen.relative,
            },
          ],
          SUBMIT: nextFlowEntrypoint,
        },
      },
    },
  } satisfies Config<ProzesskostenhilfeVereinfachteErklaerungUserData>;
};
