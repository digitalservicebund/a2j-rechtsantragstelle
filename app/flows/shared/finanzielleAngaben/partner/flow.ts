import type { Context } from "~/flows/contexts";
import type { FlowId } from "~/flows/flowIds";
import type { GenericGuard } from "~/flows/guards.server";
import type { FinanzielleAngabenPartnerTargetReplacements } from "~/flows/shared/finanzielleAngaben/partner";

const steps = {
  "/prozesskostenhilfe/formular": {
    backStep: "", // blank as we're overrriding later
    playsNoRoleTarget: "#partner-einkuenfte",
    partnerNameTarget: "#partner-einkuenfte",
    partnerIncomeTarget: "#kinder", // TODO: fix this after flow fully exists
    nextStep: "#andere-unterhaltszahlungen",
  },
  "/beratungshilfe/antrag": {
    backStep: "#einkommen.einkommen",
    playsNoRoleTarget: "#kinder.kinder-frage",
    partnerNameTarget: "#kinder.kinder-frage",
    partnerIncomeTarget: "partner-einkommen-summe",
    nextStep: "#kinder.kinder-frage",
  },
} satisfies Partial<
  Record<FlowId, FinanzielleAngabenPartnerTargetReplacements>
>;

export const getFinanzielleAngabenPartnerSubflow = <T extends Context>(
  flow: "/prozesskostenhilfe/formular" | "/beratungshilfe/antrag",
  doneFunction: GenericGuard<T>,
) => {
  return {
    id: "partner",
    initial: "partnerschaft",
    meta: {
      done: doneFunction,
    },
    on: {
      SUBMIT: steps[flow].nextStep,
    },
    states: {
      partnerschaft: {
        on: {
          BACK: steps[flow].backStep,
          SUBMIT: [
            {
              guard: "hasPartnerschaftOrSeparated",
              target: "zusammenleben",
            },
          ],
        },
      },
      zusammenleben: {
        on: {
          BACK: "partnerschaft",
          SUBMIT: [
            {
              guard: "zusammenlebenYes",
              target: "partner-einkommen",
            },
            {
              guard: "zusammenlebenNo",
              target: "unterhalt",
            },
          ],
        },
      },
      unterhalt: {
        on: {
          BACK: "zusammenleben",
          SUBMIT: [
            {
              guard: "unterhaltYes",
              target: "unterhalts-summe",
            },
            {
              guard: "unterhaltNo",
              target: "keine-rolle",
            },
          ],
        },
      },
      "keine-rolle": {
        on: {
          BACK: "unterhalt",
          SUBMIT: steps[flow].playsNoRoleTarget,
        },
      },
      "unterhalts-summe": {
        on: {
          BACK: "unterhalt",
          SUBMIT: "partner-name",
        },
      },
      "partner-name": {
        on: {
          BACK: "unterhalts-summe",
          SUBMIT: steps[flow].partnerNameTarget,
        },
      },
      "partner-einkommen": {
        on: {
          BACK: "zusammenleben",
          SUBMIT: [
            {
              guard: "partnerEinkommenYes",
              target: steps[flow].partnerIncomeTarget,
            },
            {
              guard: "partnerEinkommenNo",
              target: steps[flow].nextStep,
            },
          ],
        },
      },
    },
  };
};
