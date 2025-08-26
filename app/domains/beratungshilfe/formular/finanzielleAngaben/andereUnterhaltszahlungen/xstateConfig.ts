import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import type { Config } from "~/services/flow/server/types";
import { type BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData } from "./userData";
import { andereUnterhaltszahlungenDone } from "../doneFunctions";
import {
  hasKinderYes,
  hasWeitereUnterhaltszahlungenYes,
  hasWeitereUnterhaltszahlungenYesAndEmptyArray,
  staatlicheLeistungenIsBuergergeld,
} from "../guards";
import { berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages } from "./pages";

const steps = xStateTargetsFromPagesConfig(
  berhAntragFinanzielleAngabenAndereUnterhaltszahlungenPages,
);

export const beratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenXStateConfig =
  {
    id: "andere-unterhaltszahlungen",
    initial: steps.andereUnterhaltszahlungenFrage.relative,
    meta: { done: andereUnterhaltszahlungenDone },
    states: {
      [steps.andereUnterhaltszahlungenFrage.relative]: {
        on: {
          BACK: [
            {
              guard: staatlicheLeistungenIsBuergergeld,
              target: "#einkommen.staatliche-leistungen",
            },
            {
              guard: hasKinderYes,
              target: "#kinder.uebersicht",
            },
            "#kinder.kinder-frage",
          ],
          SUBMIT: [
            {
              guard: hasWeitereUnterhaltszahlungenYes,
              target: steps.andereUnterhaltszahlungenUebersicht.relative,
            },
            "#wohnung",
          ],
        },
      },
      [steps.andereUnterhaltszahlungenUebersicht.relative]: {
        on: {
          BACK: steps.andereUnterhaltszahlungenFrage.relative,
          SUBMIT: [
            {
              guard: hasWeitereUnterhaltszahlungenYesAndEmptyArray,
              target: steps.andereUnterhaltszahlungenWarnung.relative,
            },
            "#wohnung",
          ],
          "add-unterhaltszahlungen":
            steps.andereUnterhaltszahlungenPerson.relative,
        },
      },
      [steps.andereUnterhaltszahlungenWarnung.relative]: {
        on: {
          BACK: steps.andereUnterhaltszahlungenUebersicht.relative,
          SUBMIT: "#wohnung",
        },
      },
      [steps.andereUnterhaltszahlungenPerson.relative]: {
        initial: "daten",
        states: {
          daten: {
            on: {
              BACK: `#andere-unterhaltszahlungen.${steps.andereUnterhaltszahlungenUebersicht.relative}`,
              SUBMIT: `#andere-unterhaltszahlungen.${steps.andereUnterhaltszahlungenUebersicht.relative}`,
            },
          },
        },
      },
    },
  } satisfies Config<BeratungshilfeFinanzielleAngabenAndereUnterhaltszahlungenUserData>;
