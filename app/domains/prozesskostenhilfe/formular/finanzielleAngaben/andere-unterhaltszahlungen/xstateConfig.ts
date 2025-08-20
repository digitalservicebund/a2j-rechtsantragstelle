import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { pkhFormularFinanzielleAngabenAndereUnterhaltszahlungenPages } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/andere-unterhaltszahlungen/pages";
import type { Config } from "~/services/flow/server/buildFlowController";
import { andereUnterhaltszahlungenDone } from "../doneFunctions";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "../userData";

const steps = xStateTargetsFromPagesConfig(
  pkhFormularFinanzielleAngabenAndereUnterhaltszahlungenPages,
);

export const andereUnterhaltszahlungenXstateConfig = {
  id: "andere-unterhaltszahlungen",
  meta: { done: andereUnterhaltszahlungenDone },
  initial: steps.andereUnterhaltszahlungenFrage.relative,
  states: {
    [steps.andereUnterhaltszahlungenFrage.relative]: {
      on: {
        BACK: [
          {
            guard: "hasKinderYes",
            target: "#kinder.uebersicht",
          },
          "#kinder.kinder-frage",
        ],
        SUBMIT: [
          {
            guard: "hasWeitereUnterhaltszahlungenYes",
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
            guard: "hasWeitereUnterhaltszahlungenYesAndEmptyArray",
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
} satisfies Config<ProzesskostenhilfeFinanzielleAngabenUserData>;
