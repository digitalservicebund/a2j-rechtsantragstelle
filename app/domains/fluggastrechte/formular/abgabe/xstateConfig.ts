import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const abgabeXstateConfig = {
  meta: { done: () => false },
  id: "abgabe",
  initial: steps.abgabe.relative,
  states: {
    [steps.abgabe.relative]: {
      on: {
        BACK: steps.zusammenfassungStart.absolute,
      },
    },
  },
};
