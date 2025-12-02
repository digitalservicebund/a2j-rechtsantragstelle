import { fluggastrechteAbgabePages } from "~/domains/fluggastrechte/formular/abgabe/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const steps = xStateTargetsFromPagesConfig(fluggastrechteAbgabePages);

export const abgabeXstateConfig = {
  meta: { done: () => false },
  id: "abgabe",
  initial: steps.abgabe.relative,
  states: {
    [steps.abgabe.relative]: {
      on: {
        BACK: "#zusammenfassung.start",
      },
    },
  },
};
