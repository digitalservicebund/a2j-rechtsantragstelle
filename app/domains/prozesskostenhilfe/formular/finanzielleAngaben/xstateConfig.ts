import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/pages";
import type { Config } from "~/services/flow/server/buildFlowController";
import { ausgabenDone, ausgabenZusammenfassungDone } from "./doneFunctions";
import { finanzielleAngabenEinkuenfteXstateConfig } from "./einkuenfte/xStateConfig";
import { andereUnterhaltszahlungenXstateConfig } from "./andere-unterhaltszahlungen/xstateConfig";
import { kinderXstateConfig } from "./kinder/xstateConfig";
import { partnerXstateConfig } from "./partner/xstateConfig";
import { wohnungXstateConfig } from "./wohnung/xstateConfig";
import {
  eigentumXstateConfig,
  eigentumZusammenfassungXstateConfig,
} from "./eigentum/xstateConfig";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "./userData";

const steps = xStateTargetsFromPagesConfig(pkhFormularFinanzielleAngabenPages);

export const finanzielleAngabenXstateConfig = {
  initial: "einkuenfte",
  id: "finanzielle-angaben",
  states: {
    einkuenfte: finanzielleAngabenEinkuenfteXstateConfig,
    partner: partnerXstateConfig,
    kinder: kinderXstateConfig,
    "andere-unterhaltszahlungen": andereUnterhaltszahlungenXstateConfig,
    wohnung: wohnungXstateConfig,
    eigentum: eigentumXstateConfig,
    "eigentum-zusammenfassung": eigentumZusammenfassungXstateConfig,
    ausgaben: {
      id: "ausgaben",
      initial: "ausgaben-frage",
      meta: { done: ausgabenDone },
      states: {
        "ausgaben-frage": {
          on: {
            BACK: [
              {
                guard: "eigentumYesAndEmptyArray",
                target: "#eigentum-zusammenfassung.warnung",
              },
              {
                guard: "eigentumDone",
                target: "#eigentum-zusammenfassung.zusammenfassung",
              },
              "#eigentum.kraftfahrzeuge-frage",
            ],
            SUBMIT: [
              {
                guard: "hasAusgabenYes",
                target: "besondere-belastungen",
              },
              "#gesetzliche-vertretung",
            ],
          },
        },
        "besondere-belastungen": {
          on: {
            BACK: "ausgaben-frage",
            SUBMIT: ["#ausgaben-zusammenfassung"],
          },
        },
      },
    },
    "ausgaben-zusammenfassung": {
      id: "ausgaben-zusammenfassung",
      initial: "zusammenfassung",
      meta: { done: ausgabenZusammenfassungDone },
      states: {
        zusammenfassung: {
          on: {
            BACK: "#ausgaben.besondere-belastungen",
            SUBMIT: "#gesetzliche-vertretung",
            "add-versicherungen": "versicherungen",
            "add-ratenzahlungen": "ratenzahlungen",
            "add-sonstigeAusgaben": "sonstigeAusgaben",
          },
        },
        versicherungen: {
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: "#ausgaben-zusammenfassung",
                SUBMIT: [
                  {
                    guard: "isSonstigeVersicherung",
                    target: "sonstige-art",
                  },
                  "#ausgaben-zusammenfassung",
                ],
              },
            },
            "sonstige-art": {
              on: {
                BACK: "daten",
                SUBMIT: "#ausgaben-zusammenfassung",
              },
            },
          },
        },
        ratenzahlungen: {
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: "#ausgaben-zusammenfassung",
                SUBMIT: "zahlungspflichtiger",
              },
            },
            zahlungspflichtiger: {
              on: {
                BACK: "daten",
                SUBMIT: [
                  {
                    guard: "ratenzahlungAnteiligYes",
                    target: "betragGemeinsamerAnteil",
                  },
                  "betragGesamt",
                ],
              },
            },
            betragGemeinsamerAnteil: {
              on: {
                BACK: "zahlungspflichtiger",
                SUBMIT: "betragEigenerAnteil",
              },
            },
            betragEigenerAnteil: {
              on: {
                BACK: "betragGemeinsamerAnteil",
                SUBMIT: "restschuld",
              },
            },
            betragGesamt: {
              on: {
                BACK: "zahlungspflichtiger",
                SUBMIT: "restschuld",
              },
            },
            restschuld: {
              on: {
                BACK: [
                  {
                    guard: "ratenzahlungAnteiligYes",
                    target: "betragEigenerAnteil",
                  },
                  "betragGesamt",
                ],
                SUBMIT: "laufzeitende",
              },
            },
            laufzeitende: {
              on: {
                BACK: "restschuld",
                SUBMIT: "#ausgaben-zusammenfassung",
              },
            },
          },
        },
        sonstigeAusgaben: {
          initial: "daten",
          states: {
            daten: {
              on: {
                BACK: "#ausgaben-zusammenfassung",
                SUBMIT: "zahlungspflichtiger",
              },
            },
            zahlungspflichtiger: {
              on: {
                BACK: "daten",
                SUBMIT: [
                  {
                    guard: "sonstigeAusgabeAnteiligYes",
                    target: "betragGemeinsamerAnteil",
                  },
                  "betragGesamt",
                ],
              },
            },
            betragGemeinsamerAnteil: {
              on: {
                BACK: "zahlungspflichtiger",
                SUBMIT: "betragEigenerAnteil",
              },
            },
            betragEigenerAnteil: {
              on: {
                BACK: "betragGemeinsamerAnteil",
                SUBMIT: "#ausgaben-zusammenfassung",
              },
            },
            betragGesamt: {
              on: {
                BACK: "zahlungspflichtiger",
                SUBMIT: "#ausgaben-zusammenfassung",
              },
            },
          },
        },
      },
    },
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
