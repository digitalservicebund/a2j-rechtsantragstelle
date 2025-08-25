import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { partnerDone } from "../doneFunctions";
import {
  hasPartnerEinkommenYes,
  hasPartnerschaftYes,
  hasPartnerschaftYesAndZusammenlebenYes,
  hasUnterhaltYes,
} from "./guards";
import { berhAntragFinanzielleAngabenPartnerPages } from "./pages";
import { type BeratungshilfeFinanzielleAngabenPartnerUserData } from "./userData";

const steps = xStateTargetsFromPagesConfig(
  berhAntragFinanzielleAngabenPartnerPages,
);
export const beratungshilfeFinanzielleAngabenPartnerXstateConfig = {
  id: "partner",
  initial: steps.partnerschaft.relative,
  meta: { done: partnerDone },
  states: {
    [steps.partnerschaft.relative]: {
      on: {
        BACK: "#einkommen.einkommen",
        SUBMIT: [
          {
            guard: hasPartnerschaftYes,
            target: steps.zusammenleben.relative,
          },
          "#kinder.kinder-frage",
        ],
      },
    },
    [steps.zusammenleben.relative]: {
      on: {
        BACK: steps.partnerschaft.relative,
        SUBMIT: [
          {
            guard: hasPartnerschaftYesAndZusammenlebenYes,
            target: steps.partnerEinkommen.relative,
          },
          steps.unterhalt.relative,
        ],
      },
    },
    [steps.unterhalt.relative]: {
      on: {
        BACK: steps.zusammenleben.relative,
        SUBMIT: [
          {
            guard: hasUnterhaltYes,
            target: steps.partnerUnterhaltsSumme.relative,
          },
          steps.keineRolle.relative,
        ],
      },
    },
    [steps.keineRolle.relative]: {
      on: {
        BACK: steps.unterhalt.relative,
        SUBMIT: "#kinder.kinder-frage",
      },
    },
    [steps.partnerUnterhaltsSumme.relative]: {
      on: {
        BACK: steps.unterhalt.relative,
        SUBMIT: steps.partnerName.relative,
      },
    },
    [steps.partnerName.relative]: {
      on: {
        BACK: steps.partnerUnterhaltsSumme.relative,
        SUBMIT: "#kinder.kinder-frage",
      },
    },
    [steps.partnerEinkommen.relative]: {
      on: {
        BACK: steps.zusammenleben.relative,
        SUBMIT: [
          {
            guard: hasPartnerEinkommenYes,
            target: steps.partnerEinkommenSumme.relative,
          },
          "#kinder.kinder-frage",
        ],
      },
    },
    [steps.partnerEinkommenSumme.relative]: {
      on: {
        BACK: steps.partnerEinkommen.relative,
        SUBMIT: "#kinder.kinder-frage",
      },
    },
  },
} satisfies Config<BeratungshilfeFinanzielleAngabenPartnerUserData>;
