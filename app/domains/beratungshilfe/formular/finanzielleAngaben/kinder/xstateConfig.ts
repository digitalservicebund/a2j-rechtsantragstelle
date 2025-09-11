import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { berhAntragFinanzielleAngabenKinderPages } from "./pages";
import { type BeratungshilfeFinanzielleAngabenKinderUserData } from "./userData";
import {
  hasKinderYesAndEmptyArray,
  hasPartnerschaftYes,
  hasPartnerschaftYesAndPartnerEinkommenYes,
  hasPartnerschaftYesAndZusammenlebenNo,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo,
  hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes,
  hasPartnerschaftYesAndZusammenlebenYes,
  isValidKinderArrayIndex,
  kindEigeneEinnahmenYes,
  kindUnterhaltNo,
  kindUnterhaltYes,
  kindWohnortBeiAntragstellerNo,
  kindWohnortBeiAntragstellerYes,
} from "../guards";
import { kinderDone } from "./doneFunctions";

const steps = xStateTargetsFromPagesConfig(
  berhAntragFinanzielleAngabenKinderPages,
);

export const beratungshilfeFinanzielleAngabenKinderXstateConfig = {
  id: "kinder",
  initial: steps.kinderFrage.relative,
  meta: { done: kinderDone },
  states: {
    [steps.kinderFrage.relative]: {
      on: {
        BACK: [
          {
            guard: hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltYes,
            target: "#partner.partner-name",
          },
          {
            guard: hasPartnerschaftYesAndPartnerEinkommenYes,
            target: "#partner.partner-einkommen-summe",
          },
          {
            guard: hasPartnerschaftYesAndZusammenlebenYes,
            target: "#partner.partner-einkommen",
          },
          {
            guard: hasPartnerschaftYesAndZusammenlebenNoAndUnterhaltNo,
            target: "#partner.keine-rolle",
          },
          {
            guard: hasPartnerschaftYesAndZusammenlebenNo,
            target: "#partner.unterhalt",
          },
          {
            guard: hasPartnerschaftYes,
            target: "#partner.zusammenleben",
          },
          "#partner.partnerschaft",
        ],
        SUBMIT: [
          {
            guard: ({ context }) => context.hasKinder === "yes",
            target: steps.kinderUebersicht.relative,
          },
          "#andere-unterhaltszahlungen.frage",
        ],
      },
    },
    [steps.kinderUebersicht.relative]: {
      on: {
        BACK: steps.kinderFrage.relative,
        SUBMIT: [
          {
            guard: hasKinderYesAndEmptyArray,
            target: steps.kinderWarnung.relative,
          },
          "#andere-unterhaltszahlungen",
        ],
        "add-kinder": {
          guard: isValidKinderArrayIndex,
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
            BACK: "#kinder.uebersicht",
            SUBMIT: "wohnort",
          },
        },
        wohnort: {
          on: {
            BACK: "name",
            SUBMIT: [
              {
                guard: kindWohnortBeiAntragstellerYes,
                target: "kind-eigene-einnahmen-frage",
              },
              {
                guard: kindWohnortBeiAntragstellerNo,
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
                guard: kindEigeneEinnahmenYes,
                target: "kind-eigene-einnahmen",
              },
              "#kinder.uebersicht",
            ],
          },
        },
        "kind-eigene-einnahmen": {
          on: {
            BACK: "kind-eigene-einnahmen-frage",
            SUBMIT: "#kinder.uebersicht",
          },
        },
        "kind-unterhalt-frage": {
          on: {
            BACK: "wohnort",
            SUBMIT: [
              {
                guard: kindUnterhaltYes,
                target: "kind-unterhalt",
              },
              {
                guard: kindUnterhaltNo,
                target: "kind-unterhalt-ende",
              },
            ],
          },
        },
        "kind-unterhalt": {
          on: {
            BACK: "kind-unterhalt-frage",
            SUBMIT: "#kinder.uebersicht",
          },
        },
        "kind-unterhalt-ende": {
          on: {
            BACK: "kind-unterhalt-frage",
            SUBMIT: "#kinder.uebersicht",
          },
        },
      },
    },
  },
} satisfies Config<BeratungshilfeFinanzielleAngabenKinderUserData>;
