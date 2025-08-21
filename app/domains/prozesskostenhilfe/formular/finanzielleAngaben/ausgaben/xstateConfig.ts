import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenAusgabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/ausgaben/pages";
import type { Config } from "~/services/flow/server/buildFlowController";
import { ausgabenDone, ausgabenZusammenfassungDone } from "../doneFunctions";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenAusgabenPages,
);

export const ausgabenXstateConfig = {
  id: "ausgaben",
  initial: steps.ausgabenFrage.relative,
  meta: { done: ausgabenDone },
  states: {
    [steps.ausgabenFrage.relative]: {
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
            target: steps.ausgabenBesondereBelastungen.relative,
          },
          "#gesetzliche-vertretung",
        ],
      },
    },
    [steps.ausgabenBesondereBelastungen.relative]: {
      on: {
        BACK: steps.ausgabenFrage.relative,
        SUBMIT: ["#ausgaben-zusammenfassung"],
      },
    },
  },
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;

export const ausgabenZusammenfassungXstateConfig = {
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
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
