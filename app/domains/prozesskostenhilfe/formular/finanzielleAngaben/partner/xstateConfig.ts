import merge from "lodash/merge";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenPartnerPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/partner/pages";
import type { Config } from "~/services/flow/server/buildFlowController";
import { partnerDone } from "../doneFunctions";
import { einkuenfteDone } from "../einkuenfte/doneFunctions";
import { partnerEinkuenfteGuards } from "../einkuenfte/guards";
import { getProzesskostenhilfePartnerEinkuenfteSubflow } from "../einkuenfte/xStateConfig";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenPartnerPages,
);

export const partnerXstateConfig = {
  id: "partner",
  initial: steps.partnerschaft.relative,
  meta: {
    done: partnerDone,
  },
  states: {
    [steps.partnerschaft.relative]: {
      on: {
        BACK: [
          {
            guard: "hasFurtherIncome",
            target: "#einkuenfte.weitere-einkuenfte.uebersicht",
          },
          "#einkuenfte.weitere-einkuenfte.frage",
        ],
        SUBMIT: [
          {
            guard: "hasPartnerschaftYes",
            target: steps.partnerZusammenleben.relative,
          },
          "#kinder",
        ],
      },
    },
    [steps.partnerZusammenleben.relative]: {
      on: {
        BACK: steps.partnerschaft.relative,
        SUBMIT: [
          {
            guard: "zusammenlebenYes",
            target: steps.partnerEinkommen.relative,
          },
          steps.partnerUnterhalt.relative,
        ],
      },
    },
    [steps.partnerUnterhalt.relative]: {
      on: {
        BACK: steps.partnerZusammenleben.relative,
        SUBMIT: [
          {
            guard: "unterhaltYes",
            target: steps.partnerUnterhaltsSumme.relative,
          },
          steps.partnerKeineRolle.relative,
        ],
      },
    },
    [steps.partnerKeineRolle.relative]: {
      on: {
        BACK: steps.partnerUnterhalt.relative,
        SUBMIT: "#kinder",
      },
    },
    [steps.partnerUnterhaltsSumme.relative]: {
      on: {
        BACK: steps.partnerUnterhalt.relative,
        SUBMIT: steps.partnerName.relative,
      },
    },
    [steps.partnerName.relative]: {
      on: {
        BACK: steps.partnerUnterhaltsSumme.relative,
        SUBMIT: "#kinder",
      },
    },
    [steps.partnerEinkommen.relative]: {
      on: {
        BACK: steps.partnerZusammenleben.relative,
        SUBMIT: [
          {
            guard: "partnerEinkommenYes",
            target: "#partner-einkuenfte",
          },
          "#kinder",
        ],
      },
    },
    "partner-einkuenfte": merge(
      getProzesskostenhilfePartnerEinkuenfteSubflow(einkuenfteDone),
      {
        states: {
          [steps.partnerBesondersAusgaben.relative]: {
            on: {
              BACK: [
                {
                  guard: partnerEinkuenfteGuards.hasFurtherIncome,
                  target: "#partner-weitere-einkuenfte.partner-uebersicht",
                },
                "#partner-weitere-einkuenfte",
              ],
              SUBMIT: [
                {
                  guard: "partnerHasBesondersAusgabenYes",
                  target: "add-partner-besonders-ausgaben",
                },
                "#kinder",
              ],
            },
          },
          [steps.partnerAddBesondersAusgaben.relative]: {
            on: {
              SUBMIT: "#kinder",
              BACK: "partner-besonders-ausgaben",
            },
          },
        },
      },
    ),
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
