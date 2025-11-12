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
          steps.arbeitsausgaben.absolute,
        ],
        BACK: [
          {
            guard: ({ context }) => !context.currentlyEmployed,
            target: "#einkuenfte.einkommen",
          },
          {
            guard: ({ context }) => context.hasFurtherIncome === "yes",
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
        SUBMIT: steps.arbeitsausgaben.relative,
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
        SUBMIT: steps.arbeitsausgaben.relative,
        BACK: steps.arbeitsweg.relative,
      },
    },
    [steps.arbeitsausgaben.relative]: {
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
                guard: ({ context }) =>
                  abzuegeGuards.usesPublicTransit({ context }) ||
                  abzuegeGuards.usesPrivateVehicle({ context }),
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
              target: steps.arbeitsausgabe.relative,
            },
          },
        },
        [steps.arbeitsausgabenWarnung.relative]: {
          on: {
            BACK: steps.arbeitsausgabenUebersicht.relative,
            SUBMIT: "#finanzielle-angaben.partner",
          },
        },
        [steps.arbeitsausgabe.relative]: {
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
