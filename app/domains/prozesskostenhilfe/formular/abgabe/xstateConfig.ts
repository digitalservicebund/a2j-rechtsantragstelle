import type { Config } from "~/services/flow/server/types";
import type { ProzesskostenhilfeAbgabeUserData } from "./userData";
import { pkhFormularAbgabePages } from "./pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { readyForAbgabe } from "./guards";

const steps = xStateTargetsFromPagesConfig(pkhFormularAbgabePages);

const weitereAngabenId = "#weitere-angaben";

export const abgabeXstateConfig = {
  id: "abgabe",
  initial: steps.abgabeUeberpruefung.relative,
  meta: { excludedFromValidation: true },
  states: {
    [steps.abgabeUeberpruefung.relative]: {
      meta: { triggerValidation: true },
      on: { BACK: weitereAngabenId },
      always: [
        {
          guard: readyForAbgabe,
          target: steps.zusammenfassung.relative,
        },
      ],
    },
    [steps.dokumente.relative]: {
      on: {
        BACK: weitereAngabenId,
        SUBMIT: steps.zusammenfassung.relative,
      },
    },
    [steps.zusammenfassung.relative]: {
      on: {
        BACK: [weitereAngabenId],
        SUBMIT: steps.ende.relative,
      },
    },
    [steps.ende.relative]: {
      on: { BACK: steps.zusammenfassung.relative },
    },
  },
} satisfies Config<ProzesskostenhilfeAbgabeUserData>;
