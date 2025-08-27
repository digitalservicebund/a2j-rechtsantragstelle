import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/types";
import { beratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenXStateConfig } from "./andereUnterhaltszahlungen/xstateConfig";
import { ausgabenDone } from "./doneFunctions";
import { berhAntragFinanzielleAngabenEigentumXstateConfig } from "./eigentum/xstateConfig";
import { beratungshilfeFinanzielleAngabenEinkommenXstateConfig } from "./einkommen/xstateConfig";
import { finanzielleAngabeGuards as guards } from "./guards";
import { beratungshilfeFinanzielleAngabenKinderXstateConfig } from "./kinder/xstateConfig";
import { berhAntragFinanzielleAngabenPages } from "./pages";
import { beratungshilfeFinanzielleAngabenPartnerXstateConfig } from "./partner/xstateConfig";
import { type BeratungshilfeFinanzielleAngabenUserData } from "./userData";
import { berhAntragFinanzielleAngabenWohnungXstateConfig } from "./wohnung/xstateConfig";

const steps = xStateTargetsFromPagesConfig(berhAntragFinanzielleAngabenPages);

export const finanzielleAngabenXstateConfig = {
  initial: steps.einkommen.relative,
  id: "finanzielle-angaben",
  on: {
    SUBMIT: "#persoenliche-daten.start",
    BACK: "#rechtsproblem.situation-beschreibung",
  },
  states: {
    einkommen: beratungshilfeFinanzielleAngabenEinkommenXstateConfig,
    partner: beratungshilfeFinanzielleAngabenPartnerXstateConfig,
    kinder: beratungshilfeFinanzielleAngabenKinderXstateConfig,
    "andere-unterhaltszahlungen":
      beratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenXStateConfig,
    wohnung: berhAntragFinanzielleAngabenWohnungXstateConfig,
    eigentum: berhAntragFinanzielleAngabenEigentumXstateConfig,
    ausgaben: {
      id: "ausgaben",
      initial: "ausgaben-frage",
      meta: { done: ausgabenDone },
      states: {
        "ausgaben-frage": {
          on: {
            BACK: [
              {
                guard: guards.hasGrundeigentumYes,
                target: "#eigentum.grundeigentum.uebersicht",
              },
              "#eigentum.grundeigentum",
            ],
            SUBMIT: [
              {
                guard: guards.hasAusgabenYes,
                target: "situation",
              },
              "#persoenliche-daten.start",
            ],
          },
        },
        situation: {
          on: {
            BACK: "ausgaben-frage",
            SUBMIT: "uebersicht",
          },
        },
        uebersicht: {
          on: {
            BACK: "situation",
            SUBMIT: [
              {
                guard: guards.hasAusgabenYesAndEmptyArray,
                target: "warnung",
              },
              "#persoenliche-daten.start",
            ],
            "add-ausgaben": {
              guard: guards.isValidAusgabenArrayIndex,
              target: "ausgaben",
            },
          },
        },
        warnung: {
          on: {
            BACK: "uebersicht",
            SUBMIT: "#persoenliche-daten",
          },
        },
        ausgaben: {
          initial: "art",
          states: {
            art: {
              on: {
                BACK: "#ausgaben.uebersicht",
                SUBMIT: "zahlungsinformation",
              },
            },
            zahlungsinformation: {
              on: {
                BACK: "art",
                SUBMIT: "laufzeit",
              },
            },
            laufzeit: {
              on: {
                BACK: "zahlungsinformation",
                SUBMIT: [
                  {
                    guard: guards.hasZahlungsfristYes,
                    target: "zahlungsfrist",
                  },
                  "#ausgaben.uebersicht",
                ],
              },
            },
            zahlungsfrist: {
              on: {
                BACK: "laufzeit",
                SUBMIT: "#ausgaben.uebersicht",
              },
            },
          },
        },
      },
    },
  },
} satisfies Config<BeratungshilfeFinanzielleAngabenUserData>;
