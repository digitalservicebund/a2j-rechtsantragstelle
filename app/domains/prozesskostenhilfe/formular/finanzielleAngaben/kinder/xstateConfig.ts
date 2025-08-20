import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenKinderPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/kinder/pages";
import type { Config } from "~/services/flow/server/buildFlowController";
import { kinderDone } from "../doneFunctions";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenKinderPages,
);

export const kinderXstateConfig = {
  id: "kinder",
  initial: steps.kinderFrage.relative,
  meta: { done: kinderDone },
  states: {
    [steps.kinderFrage.relative]: {
      on: {
        SUBMIT: [
          {
            guard: "hasKinderYes",
            target: steps.kinderUebersicht.relative,
          },
          "#andere-unterhaltszahlungen.frage",
        ],
        BACK: [
          {
            guard: "hasPartnerschaftNo",
            target: "#partner",
          },
          {
            guard: "partnerEinkommenNo",
            target: "#partner.partner-einkommen",
          },
          {
            guard: "partnerHasBesondersAusgabenYes",
            target: "#partner-einkuenfte.add-partner-besonders-ausgaben",
          },
          {
            guard: "hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes",
            target: "#partner.partner-name",
          },
          {
            guard: "hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo",
            target: "#partner.partner-keine-rolle",
          },
          "#partner-einkuenfte.partner-besonders-ausgaben",
        ],
      },
    },
    [steps.kinderUebersicht.relative]: {
      on: {
        BACK: steps.kinderFrage.relative,
        SUBMIT: [
          {
            guard: "hasKinderYesAndEmptyArray",
            target: steps.kinderWarnung.relative,
          },
          "#andere-unterhaltszahlungen",
        ],
        "add-kinder": {
          guard: "isValidKinderArrayIndex",
          target: steps.kinder.relative,
        },
      },
    },
    [steps.kinderWarnung.relative]: {
      on: {
        BACK: steps.kinderUebersicht.relative,
        SUBMIT: "#andere-unterhaltszahlungen",
      },
    },
    [steps.kinder.relative]: {
      initial: "name",
      states: {
        name: {
          on: {
            BACK: `#kinder.${steps.kinderUebersicht.relative}`,
            SUBMIT: "wohnort",
          },
        },
        wohnort: {
          on: {
            BACK: "name",
            SUBMIT: [
              {
                guard: "kindWohnortBeiAntragstellerYes",
                target: "kind-eigene-einnahmen-frage",
              },
              {
                guard: "kindWohnortBeiAntragstellerNo",
                target: "kind-unterhalt-frage",
              },
            ],
          },
        },
        "kind-eigene-einnahmen-frage": {
          on: {
            BACK: "wohnort",
            SUBMIT: [
              {
                guard: "kindEigeneEinnahmenYes",
                target: "kind-eigene-einnahmen",
              },
              `#kinder.${steps.kinderUebersicht.relative}`,
            ],
          },
        },
        "kind-eigene-einnahmen": {
          on: {
            BACK: "kind-eigene-einnahmen-frage",
            SUBMIT: `#kinder.${steps.kinderUebersicht.relative}`,
          },
        },
        "kind-unterhalt-frage": {
          on: {
            BACK: "wohnort",
            SUBMIT: [
              {
                guard: "kindUnterhaltYes",
                target: "kind-unterhalt",
              },
              {
                guard: "kindUnterhaltNo",
                target: "kind-unterhalt-ende",
              },
            ],
          },
        },
        "kind-unterhalt": {
          on: {
            BACK: "kind-unterhalt-frage",
            SUBMIT: `#kinder.${steps.kinderUebersicht.relative}`,
          },
        },
        "kind-unterhalt-ende": {
          on: {
            BACK: "kind-unterhalt-frage",
            SUBMIT: `#kinder.${steps.kinderUebersicht.relative}`,
          },
        },
      },
    },
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
