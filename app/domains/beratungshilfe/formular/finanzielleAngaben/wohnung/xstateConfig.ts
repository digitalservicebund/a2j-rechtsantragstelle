import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { type Config } from "~/services/flow/server/types";
import { type BeratungshilfeFinanzielleAngabenWohnungUserData } from "./userData";
import {
  finanzielleAngabeGuards,
  hasWeitereUnterhaltszahlungenYes,
} from "../guards";
import { berhAntragFinanzielleAngabenWohnungPages } from "./pages";
import { wohnungDone } from "./doneFunctions";

const steps = xStateTargetsFromPagesConfig(
  berhAntragFinanzielleAngabenWohnungPages,
);

export const berhAntragFinanzielleAngabenWohnungXstateConfig = {
  id: "wohnung",
  initial: steps.wohnsituation.relative,
  meta: { done: wohnungDone },
  on: {
    SUBMIT: "#eigentum",
  },
  states: {
    [steps.wohnsituation.relative]: {
      on: {
        BACK: [
          {
            guard: hasWeitereUnterhaltszahlungenYes,
            target: "#andere-unterhaltszahlungen.uebersicht",
          },
          "#andere-unterhaltszahlungen.frage",
        ],
        SUBMIT: steps.wohnungGroesse.relative,
      },
    },
    [steps.wohnungGroesse.relative]: {
      on: {
        BACK: steps.wohnsituation.relative,
        SUBMIT: [
          {
            target: steps.wohnkostenAllein.relative,
            guard: finanzielleAngabeGuards.livesAlone,
          },
          {
            target: steps.personenAnzahl.relative,
            guard: finanzielleAngabeGuards.livesNotAlone,
          },
        ],
      },
    },
    [steps.wohnkostenAllein.relative]: {
      on: {
        BACK: steps.wohnungGroesse.relative,
        SUBMIT: "#eigentum",
      },
    },
    [steps.personenAnzahl.relative]: {
      on: {
        BACK: steps.wohnungGroesse.relative,
        SUBMIT: steps.wohnkostenGeteilt.relative,
      },
    },
    [steps.wohnkostenGeteilt.relative]: {
      on: {
        BACK: steps.personenAnzahl.relative,
        SUBMIT: "#eigentum",
      },
    },
  },
} satisfies Config<BeratungshilfeFinanzielleAngabenWohnungUserData>;
