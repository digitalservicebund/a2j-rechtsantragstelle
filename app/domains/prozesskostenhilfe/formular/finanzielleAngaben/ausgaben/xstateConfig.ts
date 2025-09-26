import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenAusgabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/ausgaben/pages";
import type { Config } from "~/services/flow/server/types";
import { ausgabenDone } from "../doneFunctions";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenAusgabenPages,
);

// Type must be explicitly defined instead of inferred using `satisfies`, as TS/xState incorrectly infers multi-step array items as being `undefined`
export const ausgabenXstateConfig: Config<ProzesskostenhilfeFinanzielleAngabenUserData> =
  {
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
              guard: ({ context }) => context.hasAusgaben === "yes",
              target: steps.ausgabenZusammenfassung.relative,
            },
            steps.ausgabenBesondereBelastungen.relative,
          ],
        },
      },
      [steps.ausgabenBesondereBelastungen.relative]: {
        on: {
          BACK: [
            {
              guard: ({ context }) => context.hasAusgaben === "yes",
              target: steps.ausgabenZusammenfassung.absolute,
            },
            steps.ausgabenFrage.relative,
          ],
          SUBMIT: ["#gesetzliche-vertretung"],
        },
      },
      [steps.ausgabenZusammenfassung.relative]: {
        on: {
          BACK: steps.ausgabenFrage.relative,
          SUBMIT: steps.ausgabenBesondereBelastungen.relative,
          "add-versicherungen": steps.ausgabenVersicherungen.relative,
          "add-ratenzahlungen": steps.ausgabenRatenzahlungen.relative,
          "add-sonstigeAusgaben": steps.ausgabenSonstigeAusgaben.relative,
        },
      },
      [steps.ausgabenVersicherungen.relative]: {
        initial: "daten",
        states: {
          daten: {
            on: {
              BACK: steps.ausgabenZusammenfassung.absolute,
              SUBMIT: [
                {
                  guard: "isSonstigeVersicherung",
                  target: "sonstige-art",
                },
                steps.ausgabenZusammenfassung.absolute,
              ],
            },
          },
          "sonstige-art": {
            on: {
              BACK: "daten",
              SUBMIT: steps.ausgabenZusammenfassung.absolute,
            },
          },
        },
      },
      [steps.ausgabenRatenzahlungen.relative]: {
        initial: "daten",
        states: {
          daten: {
            on: {
              BACK: steps.ausgabenZusammenfassung.absolute,
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
              SUBMIT: steps.ausgabenZusammenfassung.absolute,
            },
          },
        },
      },
      [steps.ausgabenSonstigeAusgaben.relative]: {
        initial: "daten",
        states: {
          daten: {
            on: {
              BACK: steps.ausgabenZusammenfassung.absolute,
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
              SUBMIT: steps.ausgabenZusammenfassung.absolute,
            },
          },
          betragGesamt: {
            on: {
              BACK: "zahlungspflichtiger",
              SUBMIT: steps.ausgabenZusammenfassung.absolute,
            },
          },
        },
      },
    },
  };
