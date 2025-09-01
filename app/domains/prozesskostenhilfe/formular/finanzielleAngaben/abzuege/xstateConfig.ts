import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { abzuegeDone } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/doneFunctions";
import { finanzielleAngabeAbzuegeGuards as abzuegeGuards } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/guards";
import { pkhFormularFinanzielleAngabenAbzuegePages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/abzuege/pages";
import type { Config } from "~/services/flow/server/types";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenAbzuegePages,
);

export const finanzielleAngabenAbzuegeXstateConfig = {
  id: "abzuege",
  initial: steps.arbeitsweg.relative,
  meta: { done: abzuegeDone },
  states: {
    [steps.arbeitsweg.relative]: {
      on: {
        SUBMIT: [
          {
            guard: abzuegeGuards.usesPublicTransit,
            target: steps.opnvKosten.relative,
          },
          {
            guard: abzuegeGuards.usesPrivateVehicle,
            target: steps.arbeitsplatzEntfernung.relative,
          },
          {
            guard: abzuegeGuards.commuteMethodPlaysNoRole,
            target: steps.arbeitswegKeineRolle.relative,
          },
          "#arbeitsausgaben",
        ],
        BACK: [
          {
            guard: ({ context }) => !context.currentlyEmployed,
            target: "#einkuenfte.einkommen",
          },
          {
            guard: "hasFurtherIncome",
            target: "#einkuenfte.weitere-einkuenfte.uebersicht",
          },
          "#einkuenfte.weitere-einkuenfte.frage",
        ],
      },
    },
    [steps.opnvKosten.relative]: {
      on: {
        SUBMIT: steps.arbeitsplatzEntfernung.relative,
        BACK: steps.arbeitsweg.relative,
      },
    },
    [steps.arbeitsplatzEntfernung.relative]: {
      on: {
        SUBMIT: "#arbeitsausgaben",
        BACK: [
          {
            guard: abzuegeGuards.usesPublicTransit,
            target: steps.opnvKosten.relative,
          },
          steps.arbeitsweg.relative,
        ],
      },
    },
    [steps.arbeitswegKeineRolle.relative]: {
      on: {
        SUBMIT: "#arbeitsausgaben",
        BACK: steps.arbeitsweg.relative,
      },
    },
    arbeitsausgaben: {
      id: "arbeitsausgaben",
      initial: steps.arbeitsausgabenFrage.relative,
      states: {
        [steps.arbeitsausgabenFrage.relative]: {
          on: {
            SUBMIT: [
              {
                guard: abzuegeGuards.hasAndereArbeitsausgaben,
                target: steps.arbeitsausgabenUebersicht.relative,
              },
              "#finanzielle-angaben.partner",
            ],
            BACK: [
              {
                guard:
                  abzuegeGuards.usesPublicTransit ||
                  abzuegeGuards.usesPrivateVehicle,
                target: steps.arbeitsplatzEntfernung.absolute,
              },
              {
                guard: abzuegeGuards.commuteMethodPlaysNoRole,
                target: steps.arbeitswegKeineRolle.absolute,
              },
              steps.arbeitsweg.absolute,
            ],
          },
        },
        [steps.arbeitsausgabenUebersicht.relative]: {
          on: {
            SUBMIT: [
              {
                guard: abzuegeGuards.hasAndereArbeitsausgabenAndEmptyArray,
                target: steps.arbeitsausgabenWarnung.relative,
              },
              "#finanzielle-angaben.partner",
            ],
            BACK: steps.arbeitsausgabenFrage.relative,
            "add-arbeitsausgaben": {
              guard: abzuegeGuards.isValidArbeitsausgabenArrayIndex,
              target: "arbeitsausgabe",
            },
          },
        },
        [steps.arbeitsausgabenWarnung.relative]: {
          on: {
            BACK: steps.arbeitsausgabenUebersicht.relative,
            SUBMIT: "#finanzielle-angaben.partner",
          },
        },
        arbeitsausgabe: {
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: steps.arbeitsausgabenUebersicht.absolute,
                SUBMIT: steps.arbeitsausgabenUebersicht.absolute,
              },
            },
          },
        },
      },
    },
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
