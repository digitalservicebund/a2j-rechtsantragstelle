import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularGrundvoraussetzungenPages } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/pages";
import type { ProzesskostenhilfeGrundvoraussetzungenUserData } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/userData";
import type { Config } from "~/services/flow/server/buildFlowController";
import {
  grundvoraussetzungenDone,
  isNachueberpruefung,
  verfahrenAnwalt,
  verfahrenSelbststaendig,
  versandDigitalAnwalt,
  versandDigitalGericht,
} from "./guards";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularGrundvoraussetzungenPages,
);

export const grundvoraussetzungenXstateConfig = {
  id: "grundvoraussetzungen",
  initial: steps.nachueberpruefungFrage.relative,
  meta: { done: grundvoraussetzungenDone },
  states: {
    [steps.nachueberpruefungFrage.relative]: {
      on: {
        SUBMIT: [
          {
            guard: isNachueberpruefung,
            target: steps.nameGericht.absolute,
          },
          steps.klageersteller.absolute,
        ],
        BACK: "#antragStart",
      },
    },
    nachueberpruefung: {
      initial: steps.nameGericht.relative,
      states: {
        [steps.nameGericht.relative]: {
          on: {
            SUBMIT: steps.aktenzeichen.relative,
            BACK: steps.nachueberpruefungFrage.absolute,
          },
        },
        [steps.aktenzeichen.relative]: {
          on: {
            SUBMIT: "#grundvoraussetzungen.einreichung",
            BACK: steps.nameGericht.relative,
          },
        },
      },
    },
    antrag: {
      initial: steps.klageersteller.relative,
      states: {
        [steps.klageersteller.relative]: {
          on: {
            SUBMIT: [
              {
                guard: verfahrenSelbststaendig,
                target: steps.hinweis.relative,
              },
              "#grundvoraussetzungen.einreichung",
            ],
            BACK: steps.nachueberpruefungFrage.absolute,
          },
        },
        [steps.hinweis.relative]: {
          on: {
            SUBMIT: "#grundvoraussetzungen.einreichung",
            BACK: steps.klageersteller.relative,
          },
        },
      },
    },
    einreichung: {
      initial: steps.fall.relative,
      states: {
        [steps.fall.relative]: {
          on: {
            SUBMIT: [
              {
                guard: versandDigitalAnwalt,
                target: steps.hinweisDigitalEinreichung.relative,
              },
              {
                guard: versandDigitalGericht,
                target: steps.mjp.relative,
              },
              steps.hinweisPapierEinreichung.relative,
            ],
            BACK: [
              {
                guard: isNachueberpruefung,
                target: steps.aktenzeichen.absolute,
              },
              {
                guard: verfahrenAnwalt,
                target: steps.klageersteller.absolute,
              },
              steps.hinweis.absolute,
            ],
          },
        },
        [steps.mjp.relative]: {
          on: {
            SUBMIT: steps.hinweisDigitalEinreichung.relative,
            BACK: steps.fall.relative,
          },
        },
        [steps.hinweisPapierEinreichung.relative]: {
          on: {
            SUBMIT: {
              guard: grundvoraussetzungenDone,
              target: "#antragstellende-person",
            },
            BACK: steps.fall.relative,
          },
        },
        [steps.hinweisDigitalEinreichung.relative]: {
          on: {
            SUBMIT: {
              guard: grundvoraussetzungenDone,
              target: "#antragstellende-person",
            },
            BACK: [
              {
                guard: versandDigitalGericht,
                target: steps.mjp.relative,
              },
              steps.fall.relative,
            ],
          },
        },
      },
    },
  },
} satisfies Config<ProzesskostenhilfeGrundvoraussetzungenUserData>;
