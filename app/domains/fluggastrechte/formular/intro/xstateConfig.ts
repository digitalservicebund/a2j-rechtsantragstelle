import { fluggastrechteFormularPages } from "~/domains/fluggastrechte/formular/pages";
import { xStateTargetsFromPagesConfig } from "~/domains/pageSchemas";
import { globalFeatureFlags } from "~/services/isFeatureFlagEnabled.server";

const steps = xStateTargetsFromPagesConfig(fluggastrechteFormularPages);

export const introXstateConfig = {
  id: "intro",
  initial: steps.intro.relative,
  states: {
    [steps.intro.relative]: {
      on: {
        SUBMIT: [
          {
            target: steps.grundvoraussetzungenStreitbeilegung.absolute,
            guard: () => globalFeatureFlags.showFGROnlineVerfahren,
          },
          steps.grundvoraussetzungenDatenverarbeitung.absolute,
        ],

        BACK: steps.redirectVorabcheckErgebnis.relative,
      },
    },
    [steps.redirectVorabcheckErgebnis.relative]: { on: {} },
  },
};
