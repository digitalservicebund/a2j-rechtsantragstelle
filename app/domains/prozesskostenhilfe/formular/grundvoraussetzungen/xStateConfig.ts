import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { ProzesskostenhilfeGrundvoraussetzungenUserData } from "~/domains/prozesskostenhilfe/formular/grundvoraussetzungen/userData";
import type { Config } from "~/services/flow/server/types";
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
          steps.anhaengigesGerichtsverfahrenFrage.absolute,
        ],
        BACK: "#antragStart",
      },
    },
    "anhaengiges-gerichtsverfahren": {
      initial: steps.nameGericht.relative,
      states: {
        [steps.anhaengigesGerichtsverfahrenFrage.relative]: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.anhaengigesGerichtsverfahrenFrage === "yes",
                target: steps.nameGericht.absolute,
              },
              steps.klageersteller.absolute,
            ],
            BACK: steps.nachueberpruefungFrage.absolute,
          },
        },
        [steps.nameGericht.relative]: {
          on: {
            SUBMIT: steps.aktenzeichen.relative,
            BACK: [
              {
                guard: isNachueberpruefung,
                target: steps.nachueberpruefungFrage.absolute,
              },
              steps.anhaengigesGerichtsverfahrenFrage.relative,
            ],
          },
        },
        [steps.aktenzeichen.relative]: {
          on: {
            SUBMIT: [
              {
                guard: ({ context }) =>
                  context.anhaengigesGerichtsverfahrenFrage === "yes",
                target: steps.klageersteller.absolute,
              },
              "#grundvoraussetzungen.einreichung",
            ],
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
            BACK: [
              {
                guard: isNachueberpruefung,
                target: steps.aktenzeichen.absolute,
              },
              {
                guard: ({ context }) =>
                  context.anhaengigesGerichtsverfahrenFrage === "yes",
                target: steps.aktenzeichen.absolute,
              },
              steps.anhaengigesGerichtsverfahrenFrage.absolute,
            ],
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
              {
                guard: ({ context }) =>
                  context.anhaengigesGerichtsverfahrenFrage === "yes",
                target: steps.hinweis.absolute,
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
