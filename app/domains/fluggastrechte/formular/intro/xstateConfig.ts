import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const introXstateConfig = {
  id: "intro",
  initial: steps.intro.relative,
  meta: { done: () => true },
  states: {
    [steps.intro.relative]: {
      on: {
        SUBMIT: steps.grundvoraussetzungenDatenverarbeitung.absolute,
        BACK: "redirect-vorabcheck-ergebnis",
      },
    },
    "redirect-vorabcheck-ergebnis": { on: {} },
  },
};
