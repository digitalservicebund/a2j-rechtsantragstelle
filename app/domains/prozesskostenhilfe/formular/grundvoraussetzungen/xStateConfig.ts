import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { ProzesskostenhilfeGrundvoraussetzungenUserData } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/userData";
import type { Config } from "~/services/flow/server/buildFlowController";
import {
  grundvoraussetzungenDone,
  isNachueberpruefung,
  verfahrenSelbststaendig,
  versandDigitalGericht,
} from "./guards";
import { pkhFormularGrundvoraussetzungenPages } from "./pages";

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
              "#antragstellende-person",
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
