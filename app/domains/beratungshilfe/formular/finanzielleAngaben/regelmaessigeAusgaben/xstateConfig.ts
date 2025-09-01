import {
  finanzielleAngabeGuards,
  hasGrundeigentumYes,
} from "~/domains/beratungshilfe/formular/finanzielleAngaben/guards";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { berhAntragFinanzielleAngabenRegelmassigeAusgabenPages } from "./pages";
import { type BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData } from "./userData";
import { ausgabenDone } from "../doneFunctions";

const steps = xStateTargetsFromPagesConfig(
  berhAntragFinanzielleAngabenRegelmassigeAusgabenPages,
);

export const beratungshilfeFinanzielleAngabenRegelmassigeAusgabenXstateConfig =
  {
    id: steps.ausgaben.relative,
    initial: steps.ausgabenFrage.relative,
    meta: { done: ausgabenDone },
    states: {
      [steps.ausgabenFrage.relative]: {
        on: {
          BACK: [
            {
              guard: hasGrundeigentumYes,
              target: "#eigentum.grundeigentum.uebersicht",
            },
            "#eigentum.grundeigentum",
          ],
          SUBMIT: [
            {
              guard: ({ context }) => context.hasAusgaben === "yes",
              target: steps.ausgabenSituation.relative,
            },
            "#persoenliche-daten.start",
          ],
        },
      },
      [steps.ausgabenSituation.relative]: {
        on: {
          BACK: steps.ausgabenFrage.relative,
          SUBMIT: steps.ausgabenUebersicht.relative,
        },
      },
      [steps.ausgabenUebersicht.relative]: {
        on: {
          BACK: steps.ausgabenSituation.relative,
          SUBMIT: [
            {
              guard: finanzielleAngabeGuards.hasAusgabenYesAndEmptyArray,
              target: steps.ausgabenWarnung.relative,
            },
            "#persoenliche-daten.start",
          ],
          "add-ausgaben": {
            guard: finanzielleAngabeGuards.isValidAusgabenArrayIndex,
            target: steps.ausgaben.relative,
          },
        },
      },
      [steps.ausgabenWarnung.relative]: {
        on: {
          BACK: "uebersicht",
          SUBMIT: "#persoenliche-daten",
        },
      },
      [steps.ausgabenAusgaben.relative]: {
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
                  guard: finanzielleAngabeGuards.hasZahlungsfristYes,
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
  } satisfies Config<BeratungshilfeFinanzielleAngabenRegelmassigeAusgabenUserData>;
