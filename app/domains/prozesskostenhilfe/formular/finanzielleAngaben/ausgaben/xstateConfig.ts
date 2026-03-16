import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenAusgabenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/ausgaben/pages";
import type { Config } from "~/services/flow/server/types";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";
import {
  hasGrundeigentumYes,
  hasAusgabenYes,
  hasVersicherungenYes,
  hasRatenzahlungenYes,
  hasSonstigeAusgabenYes,
  isSonstigeVersicherung,
  ratenzahlungAnteiligYes,
  sonstigeAusgabeAnteiligYes,
} from "../guards";
import { arrayIsNonEmpty } from "~/util/array";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenAusgabenPages,
);

// Type must be explicitly defined instead of inferred using `satisfies`, as TS/xState incorrectly infers multi-step array items as being `undefined`
export const ausgabenXstateConfig: Config<ProzesskostenhilfeFinanzielleAngabenUserData> =
  {
    id: "ausgaben",
    initial: steps.ausgabenFrage.relative,
    meta: { shouldAppearAsMenuNavigation: true },
    states: {
      [steps.ausgabenFrage.relative]: {
        on: {
          BACK: [
            {
              guard: hasGrundeigentumYes,
              target: "#eigentum.grundeigentum.uebersicht",
            },
            "#eigentum.grundeigentum.grundeigentum-frage",
          ],
          SUBMIT: [
            {
              guard: hasAusgabenYes,
              target: steps.ausgabenVersicherungenFrage.relative,
            },
            steps.ausgabenBesondereBelastungen.relative,
          ],
        },
      },
      [steps.ausgabenVersicherungenFrage.relative]: {
        on: {
          BACK: steps.ausgabenFrage.relative,
          SUBMIT: [
            {
              guard: hasVersicherungenYes,
              target: steps.ausgabenVersicherungenUebersicht.relative,
            },
            steps.ausgabenRatenzahlungenFrage.relative,
          ],
        },
      },
      [steps.ausgabenVersicherungenUebersicht.relative]: {
        on: {
          BACK: steps.ausgabenVersicherungenFrage.relative,
          SUBMIT: [
            {
              guard: ({ context }) =>
                hasVersicherungenYes({ context }) &&
                !arrayIsNonEmpty(context.versicherungen),
              target: steps.ausgabenVersicherungenWarnung.relative,
            },
            steps.ausgabenRatenzahlungenFrage.relative,
          ],
          "add-versicherungen": `${steps.ausgabenVersicherung.relative}.daten`,
        },
      },
      [steps.ausgabenVersicherungenWarnung.relative]: {
        on: {
          BACK: steps.ausgabenVersicherungenUebersicht.relative,
          SUBMIT: steps.ausgabenRatenzahlungenFrage.relative,
        },
      },
      [steps.ausgabenVersicherung.relative]: {
        initial: "daten",
        states: {
          daten: {
            on: {
              BACK: steps.ausgabenVersicherungenUebersicht.absolute,
              SUBMIT: [
                {
                  guard: isSonstigeVersicherung,
                  target: "sonstige-art",
                },
                steps.ausgabenVersicherungenUebersicht.absolute,
              ],
            },
          },
          "sonstige-art": {
            on: {
              BACK: "daten",
              SUBMIT: steps.ausgabenVersicherungenUebersicht.absolute,
            },
          },
        },
      },
      [steps.ausgabenRatenzahlungenFrage.relative]: {
        on: {
          BACK: [
            {
              guard: hasVersicherungenYes,
              target: steps.ausgabenVersicherungenUebersicht.relative,
            },
            steps.ausgabenVersicherungenFrage.relative,
          ],
          SUBMIT: [
            {
              guard: hasRatenzahlungenYes,
              target: steps.ausgabenRatenzahlungenUebersicht.relative,
            },
            steps.ausgabenSonstigeAusgabenFrage.relative,
          ],
        },
      },
      [steps.ausgabenRatenzahlungenUebersicht.relative]: {
        on: {
          BACK: steps.ausgabenRatenzahlungenFrage.relative,
          SUBMIT: [
            {
              guard: ({ context }) =>
                hasRatenzahlungenYes({ context }) &&
                !arrayIsNonEmpty(context.ratenzahlungen),
              target: steps.ausgabenRatenzahlungenWarnung.relative,
            },
            steps.ausgabenSonstigeAusgabenFrage.relative,
          ],
          "add-ratenzahlungen": `${steps.ausgabenRatenzahlung.relative}.daten`,
        },
      },
      [steps.ausgabenRatenzahlungenWarnung.relative]: {
        on: {
          BACK: steps.ausgabenRatenzahlungenUebersicht.relative,
          SUBMIT: steps.ausgabenSonstigeAusgabenFrage.relative,
        },
      },
      [steps.ausgabenRatenzahlung.relative]: {
        initial: "daten",
        states: {
          daten: {
            on: {
              BACK: steps.ausgabenRatenzahlungenUebersicht.absolute,
              SUBMIT: "zahlungspflichtiger",
            },
          },
          zahlungspflichtiger: {
            on: {
              BACK: "daten",
              SUBMIT: [
                {
                  guard: ratenzahlungAnteiligYes,
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
                  guard: ratenzahlungAnteiligYes,
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
              SUBMIT: steps.ausgabenRatenzahlungenUebersicht.absolute,
            },
          },
        },
      },
      [steps.ausgabenSonstigeAusgabenFrage.relative]: {
        on: {
          BACK: [
            {
              guard: hasRatenzahlungenYes,
              target: steps.ausgabenRatenzahlungenUebersicht.relative,
            },
            steps.ausgabenRatenzahlungenFrage.relative,
          ],
          SUBMIT: [
            {
              guard: hasSonstigeAusgabenYes,
              target: steps.ausgabenSonstigeAusgabenUebersicht.relative,
            },
            steps.ausgabenBesondereBelastungen.relative,
          ],
        },
      },
      [steps.ausgabenSonstigeAusgabenUebersicht.relative]: {
        on: {
          BACK: steps.ausgabenSonstigeAusgabenFrage.relative,
          SUBMIT: [
            {
              guard: ({ context }) =>
                hasSonstigeAusgabenYes({ context }) &&
                !arrayIsNonEmpty(context.sonstigeAusgaben),
              target: steps.ausgabenSonstigeAusgabenWarnung.relative,
            },
            steps.ausgabenBesondereBelastungen.relative,
          ],
          "add-sonstigeAusgaben": `${steps.ausgabenSonstigeAusgabe.relative}.daten`,
        },
      },
      [steps.ausgabenSonstigeAusgabenWarnung.relative]: {
        on: {
          BACK: steps.ausgabenSonstigeAusgabenUebersicht.relative,
          SUBMIT: steps.ausgabenBesondereBelastungen.relative,
        },
      },
      [steps.ausgabenSonstigeAusgabe.relative]: {
        initial: "daten",
        states: {
          daten: {
            on: {
              BACK: steps.ausgabenSonstigeAusgabenUebersicht.absolute,
              SUBMIT: "zahlungspflichtiger",
            },
          },
          zahlungspflichtiger: {
            on: {
              BACK: "daten",
              SUBMIT: [
                {
                  guard: sonstigeAusgabeAnteiligYes,
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
              SUBMIT: steps.ausgabenSonstigeAusgabenUebersicht.absolute,
            },
          },
          betragGesamt: {
            on: {
              BACK: "zahlungspflichtiger",
              SUBMIT: steps.ausgabenSonstigeAusgabenUebersicht.absolute,
            },
          },
        },
      },
      [steps.ausgabenBesondereBelastungen.relative]: {
        on: {
          BACK: [
            {
              guard: hasSonstigeAusgabenYes,
              target: steps.ausgabenSonstigeAusgabenUebersicht.relative,
            },
            {
              guard: hasAusgabenYes,
              target: steps.ausgabenSonstigeAusgabenFrage.relative,
            },
            steps.ausgabenFrage.relative,
          ],
          SUBMIT: ["#gesetzliche-vertretung"],
        },
      },
    },
  };
