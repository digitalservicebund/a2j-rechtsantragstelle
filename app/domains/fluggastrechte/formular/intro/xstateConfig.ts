import { fluggastrechteIntroPages } from "~/domains/fluggastrechte/formular/intro/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const steps = xStateTargetsFromPagesConfig(fluggastrechteIntroPages);
export const introXstateConfig = {
  id: steps.intro.relative,
  initial: "start",
  meta: { done: () => true },
  states: {
    start: {
      on: {
        SUBMIT: "#grundvoraussetzungen.datenverarbeitung",
        BACK: "redirect-vorabcheck-ergebnis",
      },
    },
    "redirect-vorabcheck-ergebnis": { on: {} },
  },
};
