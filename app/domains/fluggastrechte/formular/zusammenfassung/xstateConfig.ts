import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const zusammenfassungXstateConfig = {
  meta: { done: () => false },
  id: "zusammenfassung",
  initial: steps.zusammenfassungStart.relative,
  states: {
    [steps.zusammenfassungStart.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.abgabe.absolute,
            guard: "isClaimNotExceedingLimit",
          },
        ],
        BACK: steps.prozessfuehrungZahlung.absolute,
      },
    },
  },
};
